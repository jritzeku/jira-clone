import { useFormik } from 'formik'
import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useRegisterMutation } from 'slices/usersApiSlice'
import * as yup from 'yup'
import { setCredentials } from '../slices/authSlice'

//form schema
const formSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),

  password: yup
    .string()
    .min(5)
    // .matches(passwordRules, { message: 'Please create a stronger pw' })
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  jobTitle: yup.string().required('Job title is required'),
})

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()

  // @ts-ignore
  const { userInfo } = useSelector((state) => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      jobTitle: '',
      confirmPassword: '',
    },

    onSubmit: async (values) => {
      try {
        /*
          -unwrap()  will resolve to the value of the fulfilled action, or throw 
          on a rejected action. The idea here is that you should be able to 
          dispatch an asyncThunk without having to catch it every time, but only
           if you really want to write more logic based on it.
          */

        const res = await register(values)

        if (res) {
          dispatch(setCredentials({ ...res }))
          navigate(redirect)
        }
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    },

    validationSchema: formSchema,
  })

  return (
    <div className='mt-8'>
      <p className='  text-2xl mb-8 font-serif text-center'>Join Jira</p>

      <div className='flex justify-center mb-6'>
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col items-center justify-center gap-5 bg-white w-[400px] py-8 px-4'
        >
          <input
            value={formik.values.firstName}
            onChange={formik.handleChange('firstName')}
            onBlur={formik.handleBlur('firstName')}
            type='text '
            placeholder='First Name'
            className='rounded border-2 text-[14px] p-2 w-full'
          />
          {/* Err msg*/}
          <div className='text-red-400 mb-2'>
            {formik.touched.firstName && formik.errors.firstName}
          </div>

          <input
            value={formik.values.lastName}
            onChange={formik.handleChange('lastName')}
            onBlur={formik.handleBlur('lastName')}
            type='text '
            placeholder='Last Name'
            className='rounded border-2 text-[14px] p-2 w-full'
          />
          {/* Err msg*/}
          <div className='text-red-400 mb-2'>
            {formik.touched.lastName && formik.errors.lastName}
          </div>

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
            value={formik.values.jobTitle}
            onChange={formik.handleChange('jobTitle')}
            onBlur={formik.handleBlur('jobTitle')}
            type='text '
            placeholder='Job Title'
            className='rounded border-2 text-[14px] p-2 w-full'
          />
          {/* Err msg*/}
          <div className='text-red-400 mb-2'>
            {formik.touched.jobTitle && formik.errors.jobTitle}
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

          <input
            value={formik.values.confirmPassword}
            onChange={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            type='password'
            placeholder='confirm password'
            className='rounded border-2 text-[14px] p-2 w-full'
          />
          {/* Err msg*/}
          <div className='text-red-400 mb-2'>
            {formik.touched.confirmPassword && formik.errors.confirmPassword}
          </div>

          <button
            type='submit'
            className='bg-blue-700 rounded px-3 py-2 text-[12px] text-white cursor-pointer hover:brightness-90 w-full'
          >
            Register
          </button>
        </form>
      </div>

      <div className='flex flex-col items-center justify-center gap-5'>
        <p className='text-[12px] text-gray-600'>
          Already have an account ?
          <Link to='/login'>
            <span className='font-bold text-blue-600 cursor-pointer ml-2'>
              Login
            </span>
          </Link>
        </p>

        <p className='text-[10px] text-gray-500 w-[80%]'>
          Click “Sign Up” to agree to Medium’s Terms of Service and acknowledge
          that Medium’s Privacy Policy applies to you.
        </p>
      </div>
    </div>
  )
}

export default Register
