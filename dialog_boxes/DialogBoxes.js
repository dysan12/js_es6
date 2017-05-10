'use strict';
/**
 * Abstract class, implemented by classes responsible for creating user-interactive messages.
 */
class DialogBoxes {
    constructor() {};

    /**
     * Create HTML element based on defined properties.
     * @param {Object} nodeDefinition - properties assigned to HTMLElement.
     * @param {string} nodeDefinition.className - define classes.
     * @param {string} nodeDefinition.id - define id.
     * @param {string} nodeDefinition.textContents - define inner text.
     * @param {string} nodeDefinition.type - define object type. Default type is 'div'.
     * @param {array} nodeDefinition.events - consists of objects {type: event_type, handler: callback_function}.
     * @param {Object} nodeDefinition.dataSets -  sets of data in convention name_of_set : value.
     * @returns {HTMLElement}
     */
    createDefinedElement(nodeDefinition) {
        const NODE = Object.assign({
            type: 'div'
        }, nodeDefinition);

        let HTMLElement = document.createElement(NODE.type);
        Object.assign(HTMLElement, NODE);

        if (NODE.events)
            NODE.events.forEach((event) => {
                HTMLElement.addEventListener(event.type, event.handler);
            });
        if (NODE.dataSets)
            for (let name in NODE.dataSets) {
                HTMLElement.dataset[name] = NODE.dataSets[name];
            }

        return HTMLElement;
    }

}
