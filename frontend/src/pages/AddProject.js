// @ts-nocheck
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useAddProjectMutation } from 'slices/projectsApiSlice'
import { useGetUsersQuery } from 'slices/usersApiSlice'
import * as yup from 'yup'

//form schema
const formSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
})

const AddProject = () => {
  const [assignedUsers, setAssignedUsers] = useState([])

  const [category, setCategory] = useState({
    value: '',
    label: '',
  })

  const { data: users, isLoading, error } = useGetUsersQuery()

  const [addProject, { isLoading: loadingAddProject }] = useAddProjectMutation()

  const navigate = useNavigate()

  const formik = useFormik({
    //enableReinitialize: true, //necessary??

    initialValues: {
      title: '',

      description: '',
    },

    onSubmit: async (values) => {
      const data = {
        title: values?.title,
        category: category.value,
        description: values?.description,
        assignees: assignedUsers.map((user) => user.value),
      }

      try {
        await addProject(data)

        toast.success('Project added successfully')

        navigate('/projects')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    },
    validationSchema: formSchema,
  })

  return (
    <div className='w-full bg-gray-100 h-screen flex items-center justify-around '>
      <div className='w-[800px]'>
        <p className='text-xl font-semibold text-center mb-4 '>Add Project</p>

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

          {/* Category */}
          <div className='w-full flex flex-col gap-2  px-8'>
            <label
              className='text-gray-500 font-semibold text-[14px]'
              htmlFor=''
            >
              Category
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
                // setAssignee(selectedOption)
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
              Description
            </label>
            <textarea
              // value={userDetails?.aboutMe}
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
              <p>loading...</p>
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
            Add Project
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProject

/*
NOTES: 

-Unable to reach onSubmit when submitting form w/ formik 

    ->Issue with  validation?? 
        - https://github.com/jaredpalmer/formik/issues/3490#:~:text=.%20An%20error%20was%20in%20my%20yup%20validation%20schema.

    ->In my case, I had issue because was not selecting anything for category because forgot to handle onChange
*/
