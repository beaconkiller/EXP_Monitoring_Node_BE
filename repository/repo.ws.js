const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

class Repo_WS {

    // Connect to a WebSocket server
    wss = null;
    arr_clients = new Map();
    ws_connection = null;
    port = 4099;

    initialize() {
        try {
            let tmp_wss = new WebSocket.Server({ port: this.port });
            this.wss = tmp_wss;


            this.wss.on('connection', (ws) => {
                this.ws_connection = ws;

                ws.on('message', (message) => {
                    this.handle_register(ws, message);
                    this.handle_message(ws, message);
                });

                ws.on('close', () => {
                    this.handle_disconnect(ws);
                });

            });

            console.log(`WebSocket server is running on :${this.port}`);
        } catch (error) {
            console.log(error);
        }
    }



    async test_message() {

    };



    handle_message(ws, data) {
        // console.log('======== handle_message() =========');

        let device_id = ws['deviceId'];
        let message = JSON.parse(data);
        let type = message['type'];

        // this.log_incoming_message(ws, data);

        if (type == 'get_storage') {
            this.send_message('get_storage', 'get_storage', message['payload'], device_id,);
        }

        if (type == 'give_storage') {
            this.send_message('give_storage', message['payload'], 'HOST_21', device_id,);
        }

        if (type == 'server_info') {
            this.send_message('server_info', message['payload'], 'HOST_21', device_id,);
        }

        if (type == 'get_installed_db') {
            this.send_message('get_installed_db', 'get_installed_db', message['payload'], device_id,);
        }

        if (type == 'give_installed_db') {
            this.send_message('give_installed_db', message['payload'], 'HOST_21', device_id,);
        }

        if (type == 'get_status_active_postgree') {
            this.send_message('get_status_active_postgree', 'get_status_active_postgree', message['payload'], device_id,);
        }

        if (type == 'give_status_active_postgree') {
            this.send_message('give_status_active_postgree', message['payload'], 'HOST_21', device_id,);
        }

    }


    send_message(type, message, client, device_id) {
        // console.log('========= send_message() ==========');

        // console.log(type);
        // console.log(message);
        // console.log(client);

        try {
            if (!client) {
                this.ws_connection.send(JSON.stringify({ type: type, message: message, device_id: device_id }));
            } else {
                let target_client = this.arr_clients.get(client);
                target_client.send(JSON.stringify({ type: type, message: message, device_id: device_id }));
            }
        } catch (error) {
            // console.error(error);
            console.log('failed to send msg to ' + client);
        }
    }



    handle_register(ws_data, message) {
        if (typeof message == 'object') {
            message = JSON.parse(message);

            let type = message['type'];
            let deviceId = message['deviceId'];


            if (type == 'register') {
                console.log(' ');
                console.log('----- NEW CLIENT CONNECTED -----');
                console.log(deviceId);
                console.log(' ');

                ws_data.deviceId = deviceId;
                this.arr_clients.set(deviceId, ws_data);

                this.send_message('get_clients', this.getter_clients(), 'HOST_21', deviceId);
            }

        };
    }



    handle_disconnect(ws) {

        try {
            console.log(' ');

            this.arr_clients.delete(ws.deviceId);
            console.log(`--- REMOVED CLIENT --- ${ws.deviceId}`);
            this.send_message('get_clients', this.getter_clients(), 'HOST_21', 'MAIN');

            console.log(' ');
        } catch (error) {
            console.error(error);
        }
    }



    getter_clients() {
        console.log('======== getter_clients() =======');

        let arr_tmp = [];
        this.arr_clients.forEach((el) => {
            if (el.deviceId != 'HOST_21') {
                let newObj = {}

                newObj['device_id'] = el.deviceId;

                arr_tmp.push(newObj);
            }
        });

        console.log(arr_tmp);
        return arr_tmp;
    }



    log_incoming_message(ws, data) {
        let device_id = ws['deviceId'];
        let message = JSON.parse(data);
        let type = message['type'];


        console.log('=====================================')
        console.log(`FROM :  ${device_id}`);
        console.log(`TYPE :  ${type}`);
        console.log(message);
        console.log('=====================================')
    }


}

module.exports = new Repo_WS();
