const mongoose = require('mongoose')
const app = require('./app')
const ENV = require('./config/development')

const connect = () => {
    return mongoose.connect(ENV.DB_URL)
}

connect()
    .then(async (connection) => {
        app.listen(ENV.PORT)
    })
    .catch((e) => {
        console.log('error  DB/SERVER : ' + e)
    })
