const mongoose = require('mongoose')
const app = require('./app')
const ENV = require('./config/development')
const socketServer = require("./utils/notification/nofication_setup");
const http = require("http");


app.set("port", ENV.PORT);
const server = http.createServer(app);
socketServer(server)


const connect = () => {
    return mongoose.connect(ENV.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
}

connect()
    .then(async (connection) => {
        server.listen(ENV.PORT);
    })
    .catch((e) => {
        console.log('error  DB/SERVER : ' + e)
    })
