/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable global-require */
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const socketServer = require('./utils/notification/nofication_setup');

let ENV = '';
if (process.env.STATUS !== 'production' || process.env.STATUS === undefined) {
  ENV = require('./config/development');
} else {
  ENV = require('./config/production');
}

// app.set("port", ENV.PORT);
const server = http.createServer(app);
// const io = require('socket.io')(server)

const connect = () =>
  mongoose.connect(
    // 'mongodb://localhost:27017/aiascs',
    // // eslint-disable-next-line spaced-comment
    ENV.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  );

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
  // eslint-disable-next-line no-unused-vars
  .then(async (connection) => {
    server.listen(ENV.PORT, () => {
      console.log(`Listening to PORT :${ENV.PORT}`);
      socketServer(server);
    });
  })
  .catch((e) => {
    console.log(`error  DB/SERVER : ${e}`);
  });
