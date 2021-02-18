require('dotenv').config()

let MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.MONGODB_URI_TEST
}

module.exports = {
    MONGODB_URI, PORT
}