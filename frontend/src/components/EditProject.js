// @ts-nocheck
import Modal from 'components/modal/Modal'
import { useFormik } from 'formik'
import { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useGetUsersQuery } from 'slices/usersApiSlice'
import * as yup from 'yup'

import Select from 'react-select'

import { ClipLoader } from 'react-spinners'

//form schema
const formSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
})

const EditProject = ({ open, onClose, editProjectHandler, project }) => {
  const [assignedUsers, setAssignedUsers] = useState(
    project.assignees.map((a) => {
      return {
        value: a?.id,
        label: `${a?.firstName} ${a?.lastName}`,
      }
    })
  )

  const [category, setCategory] = useState({
    value: project.category,
    label: project.category,
  })

 
  const { data: users, isLoading, error } = useGetUsersQuery()

 
  const formik = useFormik({
    enableReinitialize: true, //necessary??

    initialValues: {
      title: project?.title,
      category: project?.category,
      description: project?.description,
      assignees: project?.assignees,
    },

    onSubmit: (values) => {
      const editedData = {
        projectId: project?._id,
        title: values?.title,
        category: category.value,
        description: values?.description,

        assignees: assignedUsers.map((user) => user.value),
      }

      editProjectHandler(editedData)
    },
    validationSchema: formSchema,
  })

  return (
    <Modal width={'800px'} open={open} onClose={onClose}>
      <>
        <div onClick={onClose} className='cursor-pointer ml-[90%]'>
          <AiOutlineClose />
        </div>

        <p className='text-xl font-semibold text-center  '>Edit Project</p>

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
              Project Title
            </label>
            <input
              value={formik.values.title}
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
          <div className='w-full flex flex-col gap-2  px-8'>
            <label
              className='text-gray-500 font-semibold text-[14px]'
              htmlFor=''
            >
              Project Category
            </label>

            <Select
              className='basic-single'
              classNamePrefix='select'
              isLoading={isLoading}
              value={category}
              name='category'
              options={[
                { value: 'web app', label: 'web app' },
                { value: 'desktop app', label: 'desktop app' },
                { value: 'mobile app', label: 'mobile app' },
              ]}
              onChange={(selectedOption) => {
                setCategory(selectedOption)
              }}
            />
          </div>
          {/* Description */}
          <div className=' w-full  px-8 flex flex-col gap-4   px-4 my-4'>
            <label
              className='text-gray-500 font-semibold text-[14px]'
              htmlFor=''
            >
              Project Description
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
          {/*Assignees */}
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
              <Select
                isMulti
                name='assignees'
                value={assignedUsers}
                options={users.map((user) => {
                  return {
                    value: user?.id,
                    label: `${user?.firstName} ${user?.lastName}`,
                  }
                })}
                onChange={(selectedOptions) => {
            
                  setAssignedUsers(selectedOptions)

      
                }}
                className='basic-multi-select'
                classNamePrefix='select'
              />
            )}
          </div>
          <button
            type='submit'
            className='bg-blue-600 rounded-full px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90'
          >
            Edit Project
          </button>
        </form>
      </>
    </Modal>
  )
}

export default EditProject

/*
NOTES: 

-BUG: re-renders every keystroke; seems issue with Formik

https://hackernoon.com/improving-formik-performance-when-its-slow-material-ui

-Choosing select option based on current value in DB 
  -> Simply do this <select value={optionsState}> 

https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option#:~:text=867,on%20each%20option
*/
