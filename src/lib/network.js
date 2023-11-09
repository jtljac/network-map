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
     * The IP address of this component
     *
     * Many devices will not have an IP, in which case this will be null
     * @type {?String}
     */
    ip = null

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

    /**
     * @param id {number} The ID of the component
     * @param label {string} The label for the component
     * @param params {Object}
     * @param ip {?String}
     * @param group {?String}
     * @param forwarding {boolean}
     * @param connections {Array<?(ForeignPort|Array<ForeignPort>)>}
     */
    constructor(id, label, {ip = null, group = null, forwarding = false, connections = []}) {
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

    /**
     * Get the string to display
     */
    toDisplayString() {
        let display = this.label;
        if (this.ip) display += "\n" + this.ip;
        if (this.group) display += "\n" + this.group;

        return display;
    }
}
