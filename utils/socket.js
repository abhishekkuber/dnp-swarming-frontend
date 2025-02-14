// socket.js
// import { io } from 'socket.io-client';

// let socket;

// export const createConnection = () => {
//   if (!socket) {
//     socket = io('http://localhost:4000');  // Change this URL if needed

//     socket.on('connect', () => {
//       console.log('Console logging from utils/socket.js');
//       console.log('Connected to server:', socket.id);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//       socket = null;
//     });
//   }
//   return socket;
// };

// export const getSocket = () => {
//   return socket;
// };

// utils/socket.js
import { io } from 'socket.io-client';

let socket;

// // Use the environment variable for the API URL if it exists, otherwise default to localhost
// const apiUrl = process.env.VUE_APP_API_URL;

export const createConnection = () => {
  if (!socket) {
    socket = io('https://jip-swarming-backend-d86c9bdc5010.herokuapp.com');  // Connect to the backend URL from environment variable
    // socket = io('http://localhost:4000');  // Connect to the backend URL from environment variable
    // socket = io('http://145.94.141.225:4000');  // Connect to the backend URL from environment variable
    // socket = io('http://192.168.0.101:4000');  // Connect to the backend URL from environment variable
    // heroku

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      socket = null;  // Reset the socket variable on disconnect
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};
