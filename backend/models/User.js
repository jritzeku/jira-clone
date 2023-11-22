const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

 
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, 'First name is required'],
      type: String,
    },
    lastName: {
      required: [true, 'Last name is required'],
      type: String,
    },
    dateCreated: {
      type: Date,
      default: new Date(Date.now()),
    },
    email: {
      required: [true, 'Email is required'],
      type: String,
    },
    password: {
      required: [true, 'Password is required'],
      type: String,
    },
    blurb: {
      type: String,
      default: '',
    },
    profileSet: {
      type: Boolean,
      default: false,
    },
    jobTitle: {
      type: String,
      required: true,
    },

    currToken: {
      type:String
    },
    aboutMe: {
      type: String,
      default: 'n/a',
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dgmandmlc/image/upload/v1682695332/users/avatar_g9wttl.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('remove', async function (next) {
  //grabbing user's id within the model ; no need to run query
  const userId = this.getQuery()['_id']

  // try {
  //   await Home.deleteMany({ user: userId })
  //   await Comment.deleteMany({ user: userId })
  // } catch (error) {
  //   next(error)
  // }
})

const User = mongoose.model('User', userSchema)

module.exports = User
