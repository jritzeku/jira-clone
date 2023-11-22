const asyncHandler = require('../middlewares/asyncHandler.js')
const User = require('../models/User')
const Project = require('../models/Project')

const addProjectAdmin = asyncHandler(async (req, res) => {
  console.log('Inside createProjectAdmin controller')

  const { _id: loggedInUserId } = req.user

  const { title, category, description, assignees } = req.body

  const project = await Project.create({
    title,
    description,
    category,
    assignees,
    user: loggedInUserId,
  })

  res.status(201).json(project)
})

const editProjectAdmin = asyncHandler(async (req, res) => {
  console.log('Inside editProjectAdmin controller')
  const { id } = req.params
 
  const project = await Project.findById(id)

 
  if (!project) {
    res.status(404)
    throw new Error('Project not found')
  }

  const projectEdited = await Project.findByIdAndUpdate(
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

  res.json(projectEdited)
})

const deleteProjectAdmin = asyncHandler(async (req, res) => {
  console.log('Inside deleteProjectAdmin  controller')

  const { id } = req.params

  const project = await Project.findById(id)

  if (!project) {
    res.status(404)
    throw new Error('Project not found')
  }

 
  await project.remove()

  res.json(project)
})

const getProject = asyncHandler(async (req, res) => {
  console.log('Inside getProject controller')

  const { id } = req.params

  const project = await Project.findById(id)
    .populate('user')
    .populate('assignees')
    .populate('tasks')

  if (!project) {
    res.status(404)
    throw new Error('Project not found.')
  }

  res.json(project)
})

const getProjects = asyncHandler(async (req, res) => {
  console.log('Inside getProjects controller')

  let projects = await Project.find({})
    .populate('user')
    .populate('assignees')
    .populate('tasks')

  res.json(projects)
})

module.exports = {
  addProjectAdmin,
  editProjectAdmin,
  deleteProjectAdmin,
  getProject,
  getProjects,
}
