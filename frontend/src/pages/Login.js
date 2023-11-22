// @ts-nocheck
import { useFormik } from 'formik'
import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { toast } from 'react-toastify'
import { useLoginMutation } from 'slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'

//form schema
const formSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),

  password: yup
    .string()

    .required('Password is required'),
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

 
  const { userInfo } = useSelector((state) => state.auth)
 
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

   
    onSubmit: async (values) => {
      const res = await login(values)

      if (res.error) {
        toast.error(res.error?.data?.message)
      } else {
        dispatch(setCredentials({ ...res }))
      }
    },

    validationSchema: formSchema,
  })

  useEffect(() => {
    if (userInfo) {
      navigate('/projects')
    }
  }, [navigate, userInfo])

  return (
    <div className='text-center'>
      <p className=' text-2x mb-8 font-serif  '>Log In</p>

      <div className='flex justify-center mb-6'>
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col items-center justify-center gap-5 bg-white w-[400px] py-8 px-4'
        >
          <input
            value={formik.values.email}
            onChange={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            type='text '
            placeholder='email'
            className='rounded border-2 text-[14px] p-2 w-full'
          />
          {/* Err msg*/}
          <div className='text-red-400 mb-2'>
            {formik.touched.email && formik.errors.email}
          </div>

          <input
            value={formik.values.password}
            onChange={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            type='password'
            placeholder='password'
            className='rounded border-2 text-[14px] p-2 w-full'
          />
          {/* Err msg*/}
          <div className='text-red-400 mb-2'>
            {formik.touched.password && formik.errors.password}
          </div>

          <button
            type='submit'
            className='bg-blue-700 rounded px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90 w-full'
          >
            Log in
          </button>
        </form>
      </div>

      <div className='flex flex-col items-center   gap-5'>
        <p className='text-[12px] text-gray-600'>
          Don't have an account?
          <Link to='/register'>
            <span className='font-bold text-blue-600 cursor-pointer ml-2'>
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
