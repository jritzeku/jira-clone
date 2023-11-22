const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db.js')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
 
const projectRoutes = require('./routes/projectRoutes')
 
const { notFound, errorHandler } = require('./middlewares/errorMw')
const cookieParser = require('cookie-parser')
dotenv.config()

const http = require('http')
 

const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(cors()) //allows communication between our 2 servers without CORS issu

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*

Cookie Parser is a middleware of Node JS used to get cookie
 data. To get Cookie data in ExpressJS, req. cookies property
  is used. req. cookies is an object that contains cookies 
  sent by request in JSON after parsing.
*/
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('API is running....')
})
app.use('/api/user', userRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/project', projectRoutes)
 

app.use(notFound)
app.use(errorHandler)

const server = http.createServer(app)
 

 
server.listen(port, () => console.log(`Listening on port ${port}`))

 