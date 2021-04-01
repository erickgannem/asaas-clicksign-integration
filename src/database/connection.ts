import mongoose from 'mongoose'

import Payment from './models/Payment'

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env

const connection = mongoose.connect(
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.e1fsy.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

if (connection) {
  process.stdout.write('>> [MongoDB] Client is READY\n')
}

const db = { Payment }

export default db
