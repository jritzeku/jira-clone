const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    title: {
      required: [true, 'Title is required'],
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    category: {
      type: String,
      enum: ['mobile app', 'web app', 'desktop app', 'other'],
      required: [true, 'Category is required'],
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJson: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
