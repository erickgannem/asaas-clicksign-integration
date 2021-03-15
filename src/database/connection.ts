import mongoose from 'mongoose'

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env

const connection = mongoose.connect(
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.ax80i.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

console.log(connection)

const db = {}

export default db
