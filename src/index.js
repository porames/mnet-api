import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'

import passportService from './services/passport'

import aboutRoute from './routes/aboutRoute'
import indexRoute from './routes/indexRoute'

import v1Routes from './routes/v1/index'

dotenv.config()
const {PORT = 3000, MONGO_HOST, APP_ENV, MOCHA_TEST = false} = process.env

let databaseEndpoint
if (MOCHA_TEST === false) databaseEndpoint = `${MONGO_HOST}/mnet`
else databaseEndpoint = `${MONGO_HOST}/mnet-test`

mongoose.connect(databaseEndpoint, {useCreateIndex: true, useNewUrlParser: true})

mongoose.connection.on('connected', () => {
  console.log(`${chalk.black.bgGreen(' INFO ')} connected to the database ${databaseEndpoint}`)
})

mongoose.connection.on('error', err => {
  console.log(`${chalk.black.bgRed(' FAIL ')} cannot connect to the database: ${err}`)
})

mongoose.set('useFindAndModify', false)

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))
server.use('/bucket',express.static('bucket'))
server.use(cors())

server.use(passport.initialize())
server.use(passport.session())
passportService(passport)

server.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'rayriffy')
  next()
})

server.use('/', indexRoute)

server.use('/about', aboutRoute)

server.use('/api/v1', v1Routes)

server.all('*', (req, res) => {
  res.status(404).send({
    status: 'failure',
    code: 704,
    response: {
      message: 'route not found',
    },
  })
})

server.listen(PORT, () => {
  console.log(`${chalk.black.bgGreen(' INFO ')} app is running on port ${PORT}`)
  if (APP_ENV !== 'production') {
    console.log(`${chalk.black.bgYellow(' WARN ')} this app is running on ${APP_ENV} environment!`)
  }
})

export default server
