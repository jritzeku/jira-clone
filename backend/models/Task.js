const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },

    priority: {
      //determined by how near due date is and importance/criticality of feature/bug
      type: String,
      enum: ['low', 'medium', 'high'],
      required: [true, 'Priority is required'],
    },

    timeEstimate: {
      type: Number,
    },

    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },

    status: {
      type: String,
      enum: ['not started', 'in progress', 'in review', 'completed'],
      default: 'not started',
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    requirements: {
      type: [String],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
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

taskSchema.pre('remove', async function (next) {
  try {
    // await Comment.deleteMany({ task: this.id })
  } catch (error) {
    next(error)
  }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task

/*
NOTES: 

-Limit the field options
  ->in our case, we want status to be only 1-4 cases: not started, in progress, etc. 

  https://stackoverflow.com/questions/29859910/restrict-mongoose-field-values
*/
