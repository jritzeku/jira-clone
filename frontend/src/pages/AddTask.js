// @ts-nocheck
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useGetProjectsQuery } from 'slices/projectsApiSlice'
import { useAddTaskMutation } from 'slices/tasksApiSlice'
import { useGetUsersQuery } from 'slices/usersApiSlice'
import * as yup from 'yup'
//form schema
const formSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
})

const AddTask = () => {
  const [dueDate, setDueDate] = useState(new Date())

  const [assignedUser, setAssignedUser] = useState({
    value: '',
    label: '',
  })

  const [project, setProject] = useState({
    value: '',
    label: '',
  })

  const [status, setStatus] = useState({
    value: 'not started',
    label: 'not started',
  })

  const [priority, setPriority] = useState({
    value: 'low',
    label: 'low',
  })

  const { data: users, isLoading, error } = useGetUsersQuery()

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useGetProjectsQuery()

  const [addTask, { isLoading: loadingAddProject }] = useAddTaskMutation()

  const navigate = useNavigate()

  const formik = useFormik({
    //enableReinitialize: true, //necessary??

    initialValues: {
      title: '',
      description: '',
    },

    onSubmit: async (values) => {
      const data = {
        projectId: project.value,
        title: values?.title,
        description: values?.description,
        status: status.value,
        priority: priority.value,
        dueDate: dueDate,
        assignee: assignedUser.value,
      }

      try {
        await addTask(data)

        toast.success('Task added successfully')

        navigate('/tasks')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    },
    validationSchema: formSchema,
  })

  return (
    <div className='flex flex-col  bg-gray-100 w-full  border-l-2 h-screen pt-8  '>
      {projectsLoading ? (
        <ClipLoader
          color={'#0000FF'}
          loading={projectsLoading}
          //  cssOverride={override}
          size={150}
          aria-label='Loading Spinner'
          data-testid='loader'
        />
      ) : projectsError ? (
        <div className='danger'>{error?.data?.message || error.error}</div>
      ) : (
        <div className='w-full  flex items-center justify-around '>
          <div className='w-[800px]'>
            <p className='text-xl font-semibold text-center  mb-4 '>Add Task</p>

            <form
              onSubmit={formik.handleSubmit}
              className='w-full  flex flex-col items-center justify-center gap-5 bg-white   py-8'
            >
              {/*Assignee */}

              <div className='flex flex-col gap-2 w-full  px-8'>
                <label
                  className='text-gray-500 font-semibold text-[14px]'
                  htmlFor=''
                >
                  Select project
                </label>

                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  name='project'
                  value={project}
                  options={projects.map((project) => {
                    return {
                      value: project?._id,
                      label: project?.title,
                    }
                  })}
                  onChange={(selectedOption) => {
                    setProject(selectedOption)
                  }}
                />
              </div>

              {/* Title */}

              <div className='flex flex-col gap-2 w-full  px-8'>
                <label
                  className='text-gray-500 font-semibold text-[14px]'
                  htmlFor=''
                >
                  Title
                </label>
                <input
                  value={formik.values.title}
                  //  value={project?.title}
                  onChange={formik.handleChange('title')}
                  onBlur={formik.handleBlur('title')}
                  type='text '
                  placeholder='Title'
                  className='rounded border-[1px] text-[14px] p-2 w-full'
                />
                {/* Err msg*/}
                <div className='text-red-400 mb-2'>
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>

              {/* Due Date */}

              <div className='flex flex-col gap-2 w-full  px-8'>
                <label
                  className='text-gray-500 font-semibold text-[14px]'
                  htmlFor=''
                >
                  Due Date
                </label>

                <DatePicker
                  minDate={Date.now()}
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                />
              </div>

              {/* Description */}

              <div className=' w-full  px-8 flex flex-col gap-4   px-4 my-4'>
                <label
                  className='text-gray-500 font-semibold text-[14px]'
                  htmlFor=''
                >
                  Description
                </label>
                <textarea
                  value={formik.values.description}
                  onChange={formik.handleChange('description')}
                  onBlur={formik.handleBlur('description')}
                  rows='5'
                  cols='10'
                  placeholder='Provide project description'
                  className='px-2 mx-auto appearance-none block w-full py-3 text-base leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none'
                  type='text'
                ></textarea>
                {/* Err msg */}
                <div className='text-red-500'>
                  {formik.touched.description && formik.errors.description}
                </div>
              </div>

              {/* Piority */}
              <div className='w-full flex flex-col gap-2  px-8'>
                <label
                  className='text-gray-500 font-semibold text-[14px]'
                  htmlFor=''
                >
                  Priority
                </label>

                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  isLoading={isLoading}
                  value={priority}
                  name='priority'
                  options={[
                    { value: 'low', label: 'low' },
                    { value: 'medium', label: 'medium' },
                    { value: 'high', label: 'high' },
                  ]}
                  onChange={(selectedOption) => {
                    setPriority(selectedOption)
                  }}
                />
              </div>

              {/* Status */}
              <div className='w-full flex flex-col gap-2  px-8'>
                <label
                  className='text-gray-500 font-semibold text-[14px]'
                  htmlFor=''
                >
                  Status
                </label>

                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  isLoading={isLoading}
                  value={status}
                  name='status'
                  options={[
                    { value: 'not started', label: 'not started ' },
                    { value: 'in progress', label: 'in progress' },
                    { value: 'in review', label: 'in review' },
                    { value: 'completed', label: 'completed' },
                  ]}
                  onChange={(selectedOption) => {
                    setStatus(selectedOption)
                  }}
                />
              </div>

              {/*Assignee */}

              <div className='w-full px-8 '>
                {isLoading ? (
                  <ClipLoader
                    color={'#0000FF'}
                    loading={isLoading}
                    size={150}
                    aria-label='Loading Spinner'
                    data-testid='loader'
                  />
                ) : error ? (
                  <div className='danger'>
                    {error?.data?.message || error.error}
                  </div>
                ) : (
                  <>
                    <label
                      className='text-gray-500 font-semibold text-[14px]'
                      htmlFor=''
                    >
                      Assign user
                    </label>

                    <Select
                      className='basic-single'
                      classNamePrefix='select'
                      name='assignee'
                      value={assignedUser}
                      options={users.map((user) => {
                        return {
                          value: user?.id,
                          label: `${user?.firstName} ${user?.lastName}`,
                        }
                      })}
                      onChange={(selectedOption) => {
                        setAssignedUser(selectedOption)
                      }}
                    />
                  </>
                )}
              </div>

              <button
                type='submit'
                className='bg-blue-600 rounded-full px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90'
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddTask
