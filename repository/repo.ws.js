const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

class Repo_WS {

    // Connect to a WebSocket server
    wss = null;
    arr_clients = new Map();


    initialize() {
        try {
            let tmp_wss = new WebSocket.Server({ port: 4099 });
            this.wss = tmp_wss;


            this.wss.on('connection', (ws) => {
                console.log(' ');
                console.log(' ');
                console.log(' ');


                // ws.send('Hello from server 👋');

                ws.on('message', (message) => {
                    this.handle_register(ws, message);

                    console.log(`message: ${message}`);

                    // this.handle_message(message);
                    // ws.send(`Server received: ${message}`);
                });

                ws.on('close', () => {
                    this.handle_disconnect(ws);
                });
            });

            console.log('WebSocket server is running on ws://localhost:8080');
        } catch (error) {
            console.log(error);
        }
    }



    handle_message(data) {
        let type = data['type'];
        let message = data['message'];

        if (type == 'register') {
            client_id = message;

        }
    }



    handle_register(ws_data, message) {
        message = JSON.parse(message);

        let type = message['type'];
        let deviceId = message['deviceId'];

        // console.log('--- NEW CLIENT ---');

        if (type == 'register') {
            ws_data.deviceId = deviceId;
            this.arr_clients.set(deviceId, ws_data);

            // console.log(this.arr_clients);
        }
    }



    handle_disconnect(ws) {
        if (ws.deviceId) {
            this.clients.delete(ws.deviceId);
            console.log(`--- REMOVED CLIENT --- ${ws.deviceId}`);
        }
    }



    getter_clients() {
        console.log('======== getter_clients() =======');

        console.log(this.arr_clients);
        return this.arr_clients;
    }
}

module.exports = new Repo_WS();
