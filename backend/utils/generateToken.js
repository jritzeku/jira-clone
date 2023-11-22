const jwt = require('jsonwebtoken')
const User = require('../models/User')

const storeTokenToDB = async (userId, token) => {
  const user = await User.findById(userId)

  user.currToken = token

  await user.save()
}

const generateToken = (res, userId) => {
  console.log('Inside generateToken')

  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: '30d',
  })

  storeTokenToDB(userId, token)

  // set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })
}

module.exports = generateToken
