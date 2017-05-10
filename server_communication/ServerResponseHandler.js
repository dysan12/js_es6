/**
 * Class render received JSON data from server. It is, handling every error, information,
 * redirection and response passed from server. Required instance of DialogBoxes[used methods: create(string, string, int)](responsible for displaying messages).
 * Eg. JSON:
 * {"server": {
 *		"errors": ["Error while connecting to data base.", "User unrecognized."],
 *		"information": ["The operation was aborted."]
 *	},
 *	"responses": [""]}
 */
class ServerResponseHandler {
    /**
     * Set arguments to instance properties. Set server's callbacks.
     * @param {string} response - JSON server response
     * @param {DialogBoxes} dialogBoxesInstance - DialogBoxes instance with defined method create(string, string, int)
     * @param {int} messageLifeTime - life time of messages provided in milliseconds.
     */
    constructor(response, dialogBoxesInstance, messageLifeTime = 4000) {
        const POP_UP_LIFE_TIME = messageLifeTime;

        this.dialogBoxes = (dialogBoxesInstance instanceof DialogBoxes) ? dialogBoxesInstance : null;
        this.response = JSON.parse(response);

        this.serverCallbacks = {
            redirection: (location) => {
                window.location = location;
            },
            errors: (errorMsg) => {
                this.dialogBoxes.create(errorMsg, 'popUpMsg errorMsg', POP_UP_LIFE_TIME);
            },
            information: (infoMsg) => {
                this.dialogBoxes.create(infoMsg, 'popUpMsg infoMsg', POP_UP_LIFE_TIME);
            },
            successes: (sucMsg) => {
                this.dialogBoxes.create(sucMsg, 'popUpMsg sucMsg', POP_UP_LIFE_TIME);
            },
        };
    }

    setServerCallback(name, callback) {
        this.serverCallbacks[name] = callback;
    }

    setResponseCallback(callback) {
        this.responseCallback = callback;
    }

    /**
     * Passing appropriate part of response to its destination function (for eg. errors will be passed to error handler).
     */
    handleResponse() {
        for (let actionType in this.response.server) {
            if (this.serverCallbacks.hasOwnProperty(actionType)) {
                for (let argument of this.response.server[actionType]) {
                    this.serverCallbacks[actionType](argument);
                }
            }
        }
        if (typeof this.responseCallback === 'function') {
            for (let response of this.response.responses) {
                this.responseCallback(response);
            }
        }

    }

}