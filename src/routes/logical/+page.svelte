<script>
    import Sigma from 'sigma';

    import Graph from 'graphology';
    import {circular} from 'graphology-layout';
    import forceAtlas2 from "graphology-layout-forceatlas2";
    import ForceSupervisor from 'graphology-layout-force/worker';

    import {darkMode} from "$lib/dark-mode.js";
    import {NetworkComponent} from '$lib/network.js'
    import {ignoreForwards} from "$lib/stores.js";

    import {onMount} from 'svelte';

    import Sidebar from "./sidebar.svelte";
    import {drawLabel, drawHover} from "$lib/graph-utils.js";

    const urlParams = new URLSearchParams(window.location.search);
    const focus = urlParams.get("focus")

    /* -------------------------------------------- */
    /*  State                                       */
    /* -------------------------------------------- */

    /**
     * The container for the sigma graph
     * @type {HTMLElement}
     */
    let sigmaContainer;

    /**
     * @type {Graph}
     */
    let graph = new Graph();

    /**
     * @type {Sigma}
     */
    let renderer;

    /**
     * A map of the objects in the network
     * @type {Object<Number, NetworkComponent>}
     */
    let components = {
        0: new NetworkComponent(0, "test0", {connections: [
            {device: 3, port: 0},
            {device: 1, port: 1},
            {device: 2,port: 0},
            null
        ]}),
        1: new NetworkComponent(1, "test1", {connections: [
                null, {device: 0, port: 1}, null, {device: 3, port: 1}
        ]}),
        2: new NetworkComponent(2, "test2", {group: "testGroup", connections: [
            {device: 0, port: 2},
            {device: 4, port: 0},
            null,
            null
        ]}),
        3: new NetworkComponent(3, "test3", {group: "testGroup", connections: [
            {device: 0, port: 2},
            {device: 1, port: 3},
            {device: 4, port: 0},
            null
        ]}),
        4: new NetworkComponent(4, "test4", {forwarding: true, connections: [
            [{device: 3, port: 2}, {device: 2, port: 1}]
        ]})
    }

    /**
     * The currently selected component
     * @type {?NetworkComponent}
     */
    let selectedComponent = null;

    /**
     * The currently hovered component
     *
     * This stores the component's ID
     * @type {?String}
     */
    let hoveredComponent = null;

    /**
     * The neighbours of the hovered component
     * @type {Array<Number>}
     */
    const neighbours = [];

    /**
     * @type {Array<String>}
     */
    const neighbourEdges = [];

    /* -------------------------------------------- */
    /*  Listeners                                   */
    /* -------------------------------------------- */

    /**
     * Click listener for sigma nodes
     * @param node {String} The id of the clicked node
     */
    function clickListener(node) {
        selectedComponent = components[node] || null;
    }

    /**
     * Hover listener for sigma nodes
     * @param node {String} The id of the hovered node
     */
    function hoverListener(node) {
        hoveredComponent = node;

        const hoveredComp = components[node];

        if (hoveredComp.forwarding) {
            for (const conns of hoveredComp.connections) {
                for (const conn of conns) {
                    if (!conn) continue;

                    // noinspection JSUnresolvedReference
                    neighbours.push(conn.device);

                    // noinspection JSUnresolvedReference
                    const edge = graph.edge(hoveredComp.id.toString(), conn.device.toString());
                    if (edge) neighbourEdges.push(edge)
                }
            }
        } else {
            for (const {device, port} of hoveredComp.connections.filter((/** @type {ForeignPort} */ ele) => ele !== null)) {
                const foreignComp = components[device];
                if (!foreignComp) continue;

                neighbours.push(device);
                const edge = graph.edge(hoveredComp.id.toString(), device);
                if (edge) neighbourEdges.push(edge)

                if (!($ignoreForwards && foreignComp.forwarding)) {
                    continue;
                }

                const forwardedConn = foreignComp.connections[port];
                const forward = forwardedConn.find((/** @type {ForeignPort} */ conn) => conn != null && conn.device !== hoveredComp.id);
                if (forward !== null) {
                    neighbours.push(forward.device);
                    const edge = graph.edge(foreignComp.id, forward.device);
                    if (edge) neighbourEdges.push(edge)
                }
            }
        }
    }

    function unHoverListener() {
        hoveredComponent = null;
        // Hack to clear array
        neighbours.length = 0;
        neighbourEdges.length = 0;
    }

    /* -------------------------------------------- */
    /*  Svelte Events                               */
    /* -------------------------------------------- */

    onMount(() => {
        populateGraph();
        setupGraphRenderer();

        if (focus !== null) {
            const nodeDisplay = renderer.getNodeDisplayData(focus);

            if (!nodeDisplay) return;

            renderer.getCamera().setState({
                x: nodeDisplay.x,
                y: nodeDisplay.y,
                ratio: .5
            });
        }
    });

    /* -------------------------------------------- */
    /*  Setup                                       */
    /* -------------------------------------------- */

    export function populateGraph() {
        // Edges must reference an existing node, so we have to populate the graph in two passes
        for (const [id, comp] of Object.entries(components)) {
            graph.addNode(id, {label: comp.toDisplayString(), size: 50, color: comp.forwarding ? "#F00" : "#0F0"});
        }

        for (const [id, comp] of Object.entries(components)) {
            for (const conn of comp.connections) {
                if (!conn) continue;

                // Handle forwarding connections
                if (conn instanceof Array) {
                    graph.addEdge(id, conn[0].device);
                    graph.addEdge(id, conn[1].device);
                } else {
                    graph.addEdge(id, conn.device);
                }
            }
        }

        // The nodes need to have x and y coords, so we need to generate them
        // forceAtlas2 needs there to already be coords, so generate a simple circular one first
        circular.assign(graph);
        forceAtlas2.assign(graph, {settings: forceAtlas2.inferSettings(graph), iterations: 50});

        // To allow adjusting positions
        const layout = new ForceSupervisor(graph, {});
        layout.start();
    }

    export function setupGraphRenderer() {
        renderer = new Sigma(graph, sigmaContainer);

        // Listeners
        renderer.on("clickNode", ({node}) => clickListener(node))
        renderer.on("enterNode", ({node}) => hoverListener(node))
        renderer.on("leaveNode", () => unHoverListener())

        renderer.setSetting("labelRenderer", (context, data, settings) => drawLabel(context, data, settings, $darkMode));
        renderer.setSetting("hoverRenderer", (context, data, settings) => drawHover(context, data, settings, $darkMode))

        // Handle different rendering of nodes
        renderer.setSetting("nodeReducer", (node, data) => {
            // noinspection JSValidateTypes
            /** @type {Partial<import("sigma/types").NodeDisplayData>} */
            const res = {...data};
            const comp = components[node];

            if (!comp) return res;

            if (hoveredComponent !== null) {
                if (node === hoveredComponent) {
                    res.highlighted = true;
                } else if (!neighbours.includes(comp.id)) {
                    res.label = "";

                    res.color = $darkMode ? "#202020" : "#F6F6F6";
                } else if (comp.forwarding && $ignoreForwards) {
                    res.color = $darkMode ? "#301212" : "#FAA";
                }
            } else if (comp === selectedComponent) {
                res.highlighted = true;
            }

            return res;
        });

        renderer.setSetting("edgeReducer", (edge, data) => {
            // noinspection JSValidateTypes
            /** @type {Partial<import("sigma/types").NodeDisplayData>} */
            const res = {...data};

            if (hoveredComponent && !neighbourEdges.includes(edge)) {
                res.hidden = true;
            }

            return res;
        });
    }

</script>
<div class="container">
    <div bind:this={sigmaContainer} class="sigma"/>
    <Sidebar bind:component={selectedComponent} isActive={selectedComponent !== null}/>
</div>

<style>
    .container {
        position: relative;
        flex: 1 0;
        width: 100%;
        height: 100%;

        overflow: hidden
    }
    .sigma {
        width: 100%;
        height: 100%;
    }
</style>
