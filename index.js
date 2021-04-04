const mongoose = require('mongoose')
const app = require('./app')
// const ENV = require('./config/development')
const socketServer = require("./utils/notification/nofication_setup");
const http = require("http");

// app.set("port", ENV.PORT);
const server = http.createServer(app);
// const io = require('socket.io')(server)

const connect = () => {

    return mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

}



// io.on("connection", (socket) => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => setNotificationEvent(socket), 1000);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     clearInterval(interval);
//   });
// });

// const setNotificationEvent =async (socket) => {
//   print("in  set noti");
//       // Emitting a new message. Will be consumed by the client
//       socket.emit("product","Kijacode");
//     };
// server.listen(ENV.PORT,()=>{
//   console.log("Listening to PORT :"+ ENV.PORT);
// });
connect()
    .then(async (connection) => {
        server.listen(process.env.PORT,()=>{
          console.log("Listening to PORT :"+ process.env.PORT);
          socketServer(server);
        });
    })
    .catch((e) => {
        console.log('error  DB/SERVER : ' + e)
    })
