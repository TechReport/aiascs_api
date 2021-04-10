const socketIo = require('socket.io');

const socketServer = (appServer) => {
  console.log('in socket');
  const io = socketIo(appServer);
  io.on('connect', (socket) => {
    console.log('New client connected');
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => setNotificationEvent(socket), 1000);
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      clearInterval(interval);
    });
  });
};

const setNotificationEvent = async (socket) => {
  print('in  set noti');
  // Emitting a new message. Will be consumed by the client
  socket.emit('product', 'Kijacode');
};

module.exports = socketServer;
