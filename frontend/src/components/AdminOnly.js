import { TbArrowBackUp } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const AdminOnly = () => {
  const navigate = useNavigate()

  return (
    <div
      className='
    flex
    items-center
    justify-center
    w-screen
    h-screen
    bg-gradient-to-r
    from-indigo-600
    to-blue-400
  '
    >
      <div className='  bg-white rounded-md shadow-xl'>
        <p
          onClick={() => navigate(-1)}
          className=' cursor-pointer p-4 hover:brightness-50'
        >
          <TbArrowBackUp />
          Go Back
        </p>

        <div className='flex flex-col items-center px-40 py-20'>
          <h1 className='mb-12 text-2xl font-bold text-center text-gray-800 md:text-3xl'>
            <span className='text-red-500'>Admin Only!</span>
          </h1>

          <p className='mb-8 text-center text-gray-500 md:text-lg'>
            You do not have permission to access this page
          </p>

          <a
            href='/'
            className='px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100'
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminOnly

/*
NOTES: 

-Go back 
    ->simply pass -1 as  arg with useNavigate() 

t-icons.github.io/react-icons/search
*/
