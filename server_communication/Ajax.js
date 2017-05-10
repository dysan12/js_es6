'use strict';
/**
 * Class provide connection with server via AJAX technique.
 */
class Ajax {
    /**
     * Create connection object and assign to it parameters.
     * @param {Object} settings - consists of connection details.
     * @param {string} settings.url - request URL.
     * @param {string} settings.method - request method.
     * @param {array} settings.data - data to pass, consists of objects. Syntax {name: 'name', value: 'value}.
     * @param {boolean} settings.async - perform request asynchronously.
     * @param {array} settings.headers - additional headers, consists of objects. Syntax {name: 'name', value: 'value}.
     * @param {array} settings.events - events called with server response argument, consists of objects.  Syntax
     *  {type: event_type, handler: callback_function}.
     */
    constructor(settings) {
        Object.assign(this, {
            method: 'GET',
            async: true,
            xhr: window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
        }, settings);

        //Default. Provide returning server response after firing 'callRequest' method.
        THAT.events.push({
            type: 'load',
            handler: (response) => {
                return response;
            }
        });
    }

    /**
     *  Convert provided data into 'name=value&[...]' string
     *  @returns {string}
     */
    prepareData() {
        if (!(this.data instanceof Array)) {
            throw new Error(`Handed data to Ajax object ought to be an Array type.`);
        } else if (this.data) {
            const PREPARED_ARRAY = this.data.map((component) => {
                return `${component.name}=${component.value || 'null'}`;
            });
            return PREPARED_ARRAY.join('&');
        }
        return '';
    }

    /**
     * If method was set up 'GET', concatenate data string to the URL.
     * @returns {string}
     */
    prepareURL() {
        if (this.method === 'GET') {
            const REQUEST_DATA = this.prepareData();
            return `${this.url}${REQUEST_DATA.length > 0 ? '?' : ''}${REQUEST_DATA}`;
        }
        return this.url;
    }

    /**
     * Set headers to xhr property. Set appropriate header if method wasn't set up 'GET'.
     */
    setHeaders() {
        if (this.headers)
            for (let header of this.headers) {
                this.xhr.setRequestHeader(header.name, header.value);
            }
        if (this.method !== 'GET')
            this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    /**
     * Open request.
     */
    openRequest() {
        this.xhr.open(this.method, this.prepareURL(), this.async);
    }

    /**
     * Start connection with server.
     */
    initializeRequest() {
        if (this.method === 'GET') {
            this.xhr.send();
        } else {
            this.xhr.send(this.prepareData());
        }
    }

    /**
     * Set events to xhr property.
     */
    setCallbacks() {
        const STATUS_CODES = {
                success: [200, 201, 202, 203, 204, 205],
                clientError: [400, 401, 404, 405, 406, 408],
                serverError: [500, 501, 503]
            },
            CONNECTION_JUST_OPENED = 0,
            THAT = this; // THAT used for the Babel issue.

        for (let event of THAT.events) {
            THAT.xhr.addEventListener(event.type, (state) => {
                if (THAT.xhr.status === CONNECTION_JUST_OPENED || STATUS_CODES.success.includes(THAT.xhr.status)) {
                    event.handler(THAT.xhr.responseText, THAT.xhr, state);
                } else if (STATUS_CODES.clientError.includes(THAT.xhr.status)) {
                    throw new Error(`Client side error occurred. Status code: ${THAT.xhr.status}`);
                } else if (STATUS_CODES.serverError.includes(THAT.xhr.status)) {
                    throw new Error(`Server side error occurred. Status code: ${THAT.xhr.status}`);
                }
            });
        }
    }

    /**
     * Check if method is handled, prepare connection and send request.
     * @returns {string} - server response, provided by event added in constructor.
     */
    callRequest() {
        const METHODS = ['GET', 'POST', 'DELETE', 'PUT'];

        if (METHODS.includes(this.method)) {
            this.setCallbacks();
            this.openRequest();
            this.setHeaders();
            this.initializeRequest();
        } else {
            throw new Error(`Method ${this.method} is not available.`);
        }
    }

}


