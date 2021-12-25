
const mongoose = require('mongoose')


const mongoURI = 'mongodb://localhost:27017/meals'

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((instance) =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch((error) => console.log('Connection failed!', error))

module.exports = mongoose