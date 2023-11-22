const express = require('express')

const {
  addProjectAdmin,
  editProjectAdmin,
  deleteProjectAdmin,
  getProject,
  getProjects,
} = require('../controllers/projectController.js')

const { authMw, adminMw } = require('../middlewares/userMw')
const { imgUploadMw, profileImgResizeMw } = require('../middlewares/uploadMw')

const projectRoutes = express.Router()

projectRoutes.post('/', authMw, adminMw, addProjectAdmin)
projectRoutes.put('/:id', authMw, adminMw, editProjectAdmin)
projectRoutes.delete('/:id', authMw, adminMw, deleteProjectAdmin)
projectRoutes.get('/', authMw, getProjects)

projectRoutes.get('/:id', authMw, getProject)

module.exports = projectRoutes
