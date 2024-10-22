const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db.js')
const userRoutes = require('./routes/userRoutes.js')
const taskRoutes = require('./routes/taskRoutes.js')
 
const projectRoutes = require('./routes/projectRoutes.js')
 
const { notFound, errorHandler } = require('./middlewares/errorMw.js')
const cookieParser = require('cookie-parser')
dotenv.config()
const path = require('path')
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

app.use('/api/user', userRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/project', projectRoutes)
const ___dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static(path.join(___dirname, '/frontend/build')))

  //any route that is not API will be redirected to index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(___dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  // app.get('/', (req, res) => {
  //   res.send('API is running....')
  // })
}


app.use(notFound)
app.use(errorHandler)

const server = http.createServer(app)
 
server.listen(port, () => console.log(`Listening on port ${port}`))