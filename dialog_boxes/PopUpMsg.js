'use strict';
/**
 * Class handles creating and one by one showing pop up messages.
 */
class PopUpMsg extends DialogBoxes {
    constructor() {
        super();
        this.activeDumping = false;
        this.queue = [];
        this.history = [];
    }

    /**
     * Create pop up box(message), add it to queue and start dumping already queued messages.
     * @param {string} message - box's message context.
     * @param {string} classNames - class names appended to box.
     * @param {int} lifeTime - life time of messages provided in milliseconds.
     */
    create(message, classNames, lifeTime) {
        const POP_UP = this.createDefinedElement({
            className: classNames,
            textContent: message,
        });
        this.addToQueue(POP_UP, lifeTime);
        this.switchDumping(true);
    }

    /**
     * Add to awaiting queue.
     * @param {HTMLElement} messageObject.
     * @param {int} lifeTime - life time of messages provided in milliseconds.
     */
    addToQueue(messageObject, lifeTime) {
        this.queue.push([messageObject, lifeTime]);
    }
    /**
     * Toggle dumping of queued messages.
     * @param {boolean} state - toggle state.
     */
    switchDumping(state) {
        if (state !== this.activeDumping) {
            this.activeDumping = state;

            if (this.activeDumping)
                this.dumpMessages();
        }
    }

    /**
     * Append first message in queue to document body and remove it after its life time.
     * Recursively execute function until end of queue.
     */
    dumpMessages() {
        const MSG_INDEX = 0,
            LIFE_TIME_INDEX = 1;

        if (this.queue.length && this.activeDumping) {
            let message = this.queue[0];

            document.body.appendChild(message[MSG_INDEX]);
            setTimeout(() => {
                this.addToHistory(message[MSG_INDEX]);

                message[MSG_INDEX].remove();
                this.queue.splice(0, 1);

                this.dumpMessages();
            }, message[LIFE_TIME_INDEX]);
        } else {
            this.switchDumping(false);
        }
    }

    addToHistory(message) {
        this.history.push(message);
    }

    getHistory() {
        return this.history;
    }
}
