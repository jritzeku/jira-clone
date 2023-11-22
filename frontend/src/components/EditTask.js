// @ts-nocheck
import Modal from 'components/modal/Modal'
import { useFormik } from 'formik'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { AiOutlineClose } from 'react-icons/ai'
import Select from 'react-select'
import { ClipLoader } from 'react-spinners'
import { useGetUsersQuery } from 'slices/usersApiSlice'
import * as yup from 'yup'

//form schema
const formSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  dueDate: yup.string().required('Due date is required'),
  priority: yup.string().required('Priority is required'),
  status: yup.string().required('Status is required'),
})

const EditTask = ({ open, onClose, editTaskHandler, task }) => {
  const [assignedUser, setAssignedUser] = useState({
    value: task.assignee?._id,
    label: `${task.assignee?.firstName} ${task.assignee?.lastName}`,
  })
  const [priority, setPriority] = useState({
    value: task.priority,
    label: task.priority,
  })

  const [status, setStatus] = useState({
    value: task.status,
    label: task.status,
  })

  const [dueDate, setDueDate] = useState(new Date(task.dueDate))

  const { data: users, isLoading, error } = useGetUsersQuery()

  const formik = useFormik({
    enableReinitialize: true, //necessary??

    initialValues: {
      title: task?.title,
      description: task?.description,

      dueDate: dueDate,
      priority: priority.value,
      status: status.value,
      assignee: assignedUser.value,
    },

    onSubmit: (values) => {
      const editedData = {
        taskId: task?._id,
        title: values?.title,
        dueDate: dueDate,
        description: values?.description,
        priority: priority.value,
        status: status.value,
        assignee: assignedUser.value,
      }

      editTaskHandler(editedData)
    },
    validationSchema: formSchema,
  })

  return (
    <Modal width={'800px'} open={open} onClose={onClose}>
      <>
        <div onClick={onClose} className='cursor-pointer ml-[90%]'>
          <AiOutlineClose />
        </div>

        <p className='text-xl font-semibold text-center  '>Edit task</p>

        <form
          onSubmit={formik.handleSubmit}
          className='w-full  flex flex-col items-center justify-center gap-5 bg-white   py-8'
        >
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
              onChange={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
              type='text '
              placeholder='Title'
              className='rounded border-[1px] text-[14px] p-2 w-full'
            />

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

          {/* Priority */}
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
              name='priority'
              options={[
                { value: 'not started', label: 'not started ' },
                { value: 'in progress', label: 'in progress' },
                { value: 'in review', label: 'in review' },
                { value: 'completed', label: 'completed' },
              ]}
              onChange={(selectedOption) => {
                // setAssignee(selectedOption)
                setStatus(selectedOption)
              }}
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
              placeholder='Provide task description'
              className='px-2 mx-auto appearance-none block w-full py-3 text-base leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none'
              type='text'
            ></textarea>
            {/* Err msg */}
            <div className='text-red-500'>
              {formik.touched.description && formik.errors.description}
            </div>
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
            Edit task
          </button>
        </form>
      </>
    </Modal>
  )
}

export default EditTask

 