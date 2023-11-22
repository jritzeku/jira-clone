const asyncHandler = require('../middlewares/asyncHandler.js')
const generateToken = require('../utils/generateToken.js')
const User = require('../models/User')

const loginUser = asyncHandler(async (req, res) => {
  console.log('Inside loginUser controller')
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    let result = generateToken(res, user._id)

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const registerUser = asyncHandler(async (req, res) => {
  console.log('Inside registerUser controller')
  const { firstName, lastName, jobTitle, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    jobTitle,

    email,
    password,
  })

 

  if (user) {
    generateToken(res, user._id)

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), //makes it expire NOW
  })
  res.status(200).json({ message: 'Logged out successfully' })
}

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      currToken: user.currToken,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const editUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
 
    user.jobTitle = req.body.jobTitle || user.jobTitle
    user.aboutMe = req.body.aboutMe || user.aboutMe
    user.image = req.body.image || user.image

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

const editUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    // user.email = req.body.email || user.email
    user.jobTitle = req.body.jobTitle || user.jobTitle
    user.aboutMe = req.body.aboutMe || user.aboutMe
    user.image = req.body.image || user.image
    user.isAdmin = req.body.isAdmin || user.isAdmin

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json(updatedUser)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const deleteUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Can not delete admin user')
    }
    await User.deleteOne({ _id: user._id })
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  editUserProfile,
  getUsers,
  deleteUserAdmin,
  editUserAdmin,
}
 