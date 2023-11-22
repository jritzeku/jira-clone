const express = require('express')

const {
  createTaskAdmin,
  getTask,
  getTasks,
  deleteTaskAdmin,
  getMyTasks,
  editTaskAdmin,
  getProjectTasks,
} = require('../controllers/taskController.js')

const { authMw, adminMw } = require('../middlewares/userMw')
const { imgUploadMw, profileImgResizeMw } = require('../middlewares/uploadMw')

const taskRoutes = express.Router()

taskRoutes.post('/:id', authMw, adminMw, createTaskAdmin)
taskRoutes.put('/:id', authMw, adminMw, editTaskAdmin)
taskRoutes.delete('/:id', authMw, adminMw, deleteTaskAdmin)
taskRoutes.get('/', authMw, getTasks)
taskRoutes.get('/myTasks', authMw, getMyTasks)
taskRoutes.get('/projectTasks/:id', authMw, getProjectTasks)
taskRoutes.get('/:id', authMw, getTask)

module.exports = taskRoutes
