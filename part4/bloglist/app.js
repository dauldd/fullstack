const express = require('express')
const app = express()
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')


mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to mongodb')
  })
  .catch((error) => {
    logger.error('Error connecting to mongodb:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)


app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
