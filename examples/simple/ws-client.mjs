import WebSocket from 'ws';

const socket = new WebSocket('ws://localhost:3000/io/echo');

socket.on('open', () => {
  socket.send('Hello from client!');
});

socket.onmessage = (event) => {
  console.log(event.data);
};
