const asyncHandler = require('../middlewares/asyncHandler.js')
const User = require('../models/User')
const Task = require('../models/Task')
const Project = require('../models/Project')

const createTaskAdmin = asyncHandler(async (req, res) => {
  console.log('Inside createTaskAdmin controller')

  const { id: projectId } = req.params
  const { _id: loggedInUserId } = req.user

  const { title, priority, dueDate, description, status, assignee } = req.body

  const task = await Task.create({
    project: projectId,
    user: loggedInUserId,
    title,
    priority,
    dueDate,
    description,
    status,
    assignee,
  })

  await Project.findByIdAndUpdate(
    projectId,
    {
      $push: { tasks: task._id },
    },
    { new: true }
  )

  res.status(201).json(task)
})

const getTask = asyncHandler(async (req, res) => {
  console.log('Inside getTask controller')

  const { id } = req.params

  const task = await Task.findById(id).populate('comments').populate('user')

  if (!task) {
    res.status(404)
    throw new Error('task not found.')
  }

  res.json(task)
})

const getTasks = asyncHandler(async (req, res) => {
  console.log('Inside getTasks controller')

  const keyword = req.query.keyword
    ? [
        {
          title: {
            //reason for using regex is so we dont have to type EXACT thing to perform search
            $regex: req.query.keyword,
            $options: 'i', //case insensitive
          },
        },

        {
          assignee: {
            //reason for using regex is so we dont have to type EXACT thing to perform search
            $regex: req.query.keyword,
            $options: 'i', //case insensitive
          },
        },

        {
          user: {
            //reason for using regex is so we dont have to type EXACT thing to perform search
            $regex: req.query.keyword,
            $options: 'i', //case insensitive
          },
        },
      ]
    : {}

  let tasks

  if (JSON.stringify(keyword) === '{}') {
    tasks = await Task.find({})
      .populate('user')
      .populate('comments')
      .populate('assignee')
  } else {
    tasks = await Task.find({
      $or: [keyword[0], keyword[1], keyword[2]],
    })
      .populate('user')
      .populate('comments')
      .populate('assignee')
  }

  res.json(tasks)
})

const getProjectTasks = asyncHandler(async (req, res) => {
  console.log('Inside getProjectTasks controller')
  const { id: projId } = req.params

  let tasks = await Task.find({ project: projId })
    .populate('user')
    .populate('comments')
    .populate('assignee')

  res.json(tasks)
})

const getMyTasks = asyncHandler(async (req, res) => {
  console.log('Inside getMyTasks controller')

  const { _id: loggedInUserId } = req.user

  const tasks = await Task.find({ assignee: loggedInUserId })
    .populate('user')
    .populate('comments')
    .populate('assignee')

  res.json(tasks)
})

/*

*********************************************************************************** 
This will be multi-purpose function, used for:
  ->edit task details 
  ->update task status
  ->assign user to task

*/
const editTaskAdmin = asyncHandler(async (req, res) => {
  console.log('Inside editTaskAdmin controller')
  const { id } = req.params

  const task = await Task.findById(id)

  if (!task) {
    res.status(404)
    throw new Error('Task not found')
  }

  const taskEdited = await Task.findByIdAndUpdate(
    id,
    {
      // since we can potentially edit every field, just use spread operator
      ...req.body,
      user: req.user?._id,
    },
    {
      new: true,
    }
  )

  res.json(taskEdited)
})

const deleteTaskAdmin = asyncHandler(async (req, res) => {
  console.log('Inside deleteTaskAdmin  controller')

  const { id } = req.params
  const { _id: loggedInUserId } = req.user

  console.log('id: ' + id)

  const task = await Task.findById(id)
  let assignee = task.assignee

  const taskCreator = await User.findById(loggedInUserId)

  if (!task) {
    res.status(404)
    throw new Error('Task not found')
  }

  await task.remove()

  res.json(task)
})

module.exports = {
  createTaskAdmin,
  editTaskAdmin,
  deleteTaskAdmin,
  getTask,
  getTasks,
  getProjectTasks,
  getMyTasks,
}
