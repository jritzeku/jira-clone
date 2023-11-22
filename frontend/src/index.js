// @ts-nocheck
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'

import NotFound from 'components/NotFound'
import PrivateRoute from 'components/PrivateRoute'
import AddProject from 'pages/AddProject'
import AddTask from 'pages/AddTask'
import Login from 'pages/Login'
import Projects from 'pages/Projects'
import Register from 'pages/Register'
import Tasks from 'pages/Tasks'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import store from './store'
import App from './App'

import AdminRoute from 'components/AdminRoute'
import KanbanBoard from 'pages/KanbanBoard'

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import 'react-tooltip/dist/react-tooltip.css'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route index={true} path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        {/* Registered  users */}

        <Route path='' element={<PrivateRoute />}>
          <Route path='/projects' element={<Projects />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/kanban-board' element={<KanbanBoard />} />
        </Route>

        {/* Admin users */}

        <Route path='' element={<AdminRoute />}>
          <Route path='/add-project' element={<AddProject />} />
          <Route path='/add-task' element={<AddTask />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFound />} />
    </>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

/*

NOTES: 

-Dragging issue  caused by Strict mode 
  ->simply remove strict mode

  https://github.com/atlassian/react-beautiful-dnd/issues/2407#:~:text=Current%20version%20of%20react%2Ddnd%20does%20not%20support%20%3CReact.StrictMode%20/


*/
