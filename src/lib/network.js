export class NetworkComponent {
    /**
     * A unique ID for the component
     * @type {Number}
     */
    id;

    /**
     * A friendly name for the component
     * @type {String}
     */
    label = "Component";

    /**
     * The group this component belongs to
     *
     * When undefined the component does not belong to any group
     * @type {?String}
     */
    group= null;

    /**
     * Whether this component forwards it's
     * @type {boolean}
     */
    forwarding = false

    /**
     * A reference to a port on another component
     * @typedef ForeignPort
     * @property {Number} device The device that this connects to
     * @property {Number} port The port on the device this connects to
     */

    /**
     * The connections of this component
     * @type {Array<?(ForeignPort|Array<ForeignPort>)>}
     */
    connections = [];

    constructor(id, label, group, forwarding, connections) {
        this.id = id;
        this.label = label;
        this.group = group;

        this.forwarding = forwarding

        if (!connections.every(ele => ele instanceof Array === forwarding)) throw new TypeError(
            forwarding
                ? "All elements in connections must be a 2 component array"
                : "All elements in connections must be a single value"
        )

        this.connections = connections;
    }
}
