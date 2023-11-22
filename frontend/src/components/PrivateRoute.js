// @ts-nocheck
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import { useGetUserQuery } from 'slices/usersApiSlice'
import { ClipLoader } from 'react-spinners'

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth)

  const { data: user, isLoading, error } = useGetUserQuery(userInfo?._id)

  return userInfo ? (
    <>
      {isLoading ? (
        <ClipLoader
          color={'#0000FF'}
          loading={isLoading}
 
          size={150}
          aria-label='Loading Spinner'
          data-testid='loader'
        />
      ) : error ? (
        <div className='danger'>{error?.users?.message || error.error}</div>
      ) : (
        <div className='flex items-center gap-2   '>
          <Sidebar userInfo={userInfo} user={user} />

          <Outlet />
        </div>
      )}
    </>
  ) : (
    <Navigate to='/login' replace />
  )
}

export default PrivateRoute
