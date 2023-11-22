// @ts-nocheck
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useGetUserQuery } from 'slices/usersApiSlice'
import AdminOnly from './AdminOnly'
import Sidebar from './Sidebar'

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state?.auth)

  const { data: user, isLoading, error } = useGetUserQuery(userInfo?._id)
 

  return userInfo.data.isAdmin === true ? (
    <div className='flex items-center  gap-2'>
      <Sidebar userInfo={userInfo} user={user} />

      <Outlet />
    </div>
  ) : (
 

    <AdminOnly />
  )
}

export default AdminRoute
