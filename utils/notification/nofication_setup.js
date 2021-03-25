const socketIo = require("socket.io").Server;


const socketServer = (appServer) =>{
    const io = new socketIo(appServer);

console.log("were in");
io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => setNotificationEvent(socket), 1000);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });


}
  const setNotificationEvent =async (socket) => {

    // Emitting a new message. Will be consumed by the client
    socket.emit("e1",await blogs());
  };



  module.exports = socketServer;