const express = require('express')

const {
  registerUser,
  loginUser,
  logoutUser,
  editUserProfile,
  getUsers,
  editUserAdmin,
  deleteUserAdmin,
  getUser,
} = require('../controllers/userController')

const { authMw, adminMw } = require('../middlewares/userMw')
const { imgUploadMw, profileImgResizeMw } = require('../middlewares/uploadMw')

const userRoutes = express.Router()

userRoutes.post('/', registerUser)

userRoutes.post('/login', loginUser)

userRoutes.post('/logout', logoutUser)

userRoutes.put(
  '/editProfile',
  authMw,
  // imgUploadMw.single('image'),
  // profileImgResizeMw,
  editUserProfile
)

userRoutes.delete('/:id', authMw, adminMw, deleteUserAdmin)

userRoutes.get('/', authMw, getUsers)
userRoutes.get('/:id', authMw, getUser)

module.exports = userRoutes
