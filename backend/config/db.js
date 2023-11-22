 
const mongoose = require('mongoose')

 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

     console.log('Connected to database successfully.')
  } catch (error) {
    console.log(`Failed to connect to database. Error: ${error.message}`)
  }
}

module.exports = connectDB
