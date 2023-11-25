import { AiOutlineLogout } from 'react-icons/ai'
import { BsGear, BsKanban } from 'react-icons/bs'
import { FiPlusCircle } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../slices/authSlice'
import { AiOutlineFolderOpen } from 'react-icons/ai'
import { BsListTask } from 'react-icons/bs'
import { useLogoutMutation } from '../slices/usersApiSlice'

const Sidebar = ({ userInfo, user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      //unwrap() returns the resolved value from Promise
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='w-[260px] h-screen '>
      <div className='w-full h-full     '>
        {/* <!--LOGO start--> */}

        <div className='flex items-center  gap-4 ml-8 mt-12'>
          <img
            src='https://res.cloudinary.com/dgmandmlc/image/upload/v1682695332/users/avatar_g9wttl.png'
            alt='alt placeholder'
            className='w-10 h-10  mb-5 rounded'
          />

          <span className='text-[14px]'>Welcome back {user?.email} </span>
        </div>
        {/* <!--LOGO end--> */}

        {/* <!--NAV start--> */}
        <ul className='text-gray-600 text-[14px] font-bold  mt-12 flex flex-col gap-2'>
          {userInfo?.data?.isAdmin && (
            <>
              <li className=' pl-6 block cursor-pointer p-2   hover:text-blue-600 hover:bg-gray-300'>
                <Link to='/add-project'>
                  <div className='flex items-center gap-2'>
                    <FiPlusCircle />
                    <p> Create Project</p>
                  </div>
                </Link>
              </li>
              <li className=' pl-6 block cursor-pointer p-2   hover:text-blue-600 hover:bg-gray-300'>
                <Link to='/add-task'>
                  <div className='flex items-center gap-2'>
                    <FiPlusCircle />
                    <p> Create Task</p>
                  </div>
                </Link>
              </li>
            </>
          )}

          <li className='pl-6 block cursor-pointer p-2  hover:text-blue-600  hover:bg-gray-300'>
            <Link to='/projects'>
              <div className='flex items-center gap-2'>
                <AiOutlineFolderOpen />
                <p> Projects</p>
              </div>
            </Link>
          </li>

          <li className='pl-6 block cursor-pointer p-2  hover:text-blue-600  hover:bg-gray-300'>
            <Link to='/tasks'>
              <div className='flex items-center gap-2'>
                <BsListTask />
                <p> Tasks</p>
              </div>
            </Link>
          </li>

          <li className='pl-6 block cursor-pointer p-2 hover:text-blue-600 hover:bg-gray-300'>
            <Link to='/kanban-board'>
              <div className='flex items-center gap-2  '>
                <BsKanban />
                <p> Kanban Board</p>
              </div>
            </Link>
          </li>

          <li className=' pl-6 block cursor-pointer p-2 hover:text-blue-600  hover:bg-gray-300 mt-[40px]'>
            <div onClick={logoutHandler} className='flex items-center gap-2'>
              <AiOutlineLogout />
              <p> Log out</p>
            </div>
          </li>
        </ul>
        {/* <!--NAV end--> */}
      </div>
    </div>
  )
}

export default Sidebar

/*
NOTES:

-Show sidebar only when authenticated
    ->for admin the sidebar options will be little different 

    
*/
