const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:4099');

socket.on('open', () => {
  console.log('Connected to server');

  socket.send(JSON.stringify({
    type: 'register',
    deviceId: 'nodeClient001',
  }));
});

socket.on('message', (data) => {
  console.log('Received :');
  console.log(JSON.parse(data));
});

socket.on('close', () => {
  console.log('Connection closed');
});

socket.on('error', (err) => {
  console.error('Error:', err.message);
});



const socket2 = new WebSocket('ws://localhost:4099');

socket2.on('open', () => {
  console.log('Connected to server');

  socket2.send(JSON.stringify({
    type: 'register',
    deviceId: 'nodeClient002',
  }));
});

socket2.on('message', (data) => {
  console.log('Received :');
  console.log(JSON.parse(data));
});

socket2.on('close', () => {
  console.log('Connection closed');
});

socket2.on('error', (err) => {
  console.error('Error:', err.message);
});
