const asyncHandler = require('../middlewares/asyncHandler.js')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMw = asyncHandler(async (req, res, next) => {
  console.log('INside authMw')
  let token

  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY)
      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
})

const adminMw = asyncHandler(async (req, res, next) => {
  console.log('Inside adminMW')

  console.log(req.user) //undefined!!!!
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
})

module.exports = { authMw, adminMw }
