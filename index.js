const http = require('http')
const app = require('./app')
const config = require('.//utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

const server = http.createServer(app)

const PORT = config.PORT
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})