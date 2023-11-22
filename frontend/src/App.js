import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { logout } from './slices/authSlice'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from 'components/Sidebar'
 

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime')
    if (expirationTime) {
      const currentTime = new Date().getTime()

      // @ts-ignore
      if (currentTime > expirationTime) {
        dispatch(logout())
      }
    }
  }, [dispatch])

  return (
    <>
      <ToastContainer />
      {/* <Header /> */}

      <main className=' '>
        <div className=' '>
          <Outlet />
        </div>
      </main>
 
    </>
  )
}

export default App

/*
NOTES:

-BUG
  ->Uncaught Error: could not find react-redux context value; please ensure the component is wrapped in a <Provider>

https://stackoverflow.com/questions/59476912/testing-custom-hook-invariant-violation-could-not-find-react-redux-context-val
*/
