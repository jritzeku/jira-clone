// @ts-nocheck
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetProjectsQuery } from 'slices/projectsApiSlice'

import { DateTime } from 'luxon'
import { useMemo } from 'react'

import EditTask from 'components/EditTask'
import TaskDetail from 'components/TaskDetail'
import Select from 'react-select'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import {
  useDeleteTaskMutation,
  useEditTaskMutation,
  useGetTasksQuery,
} from 'slices/tasksApiSlice'
import Table from './Table'

const Tasks = () => {
  const { data: tasks, isLoading, error, refetch } = useGetTasksQuery()

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: projectsRefetch,
  } = useGetProjectsQuery()

  const [deleteTask, { isLoading: loadingDelete }] = useDeleteTaskMutation()

  const [editTask, { isLoading: loadingEdit }] = useEditTaskMutation()

  const [project, setProject] = useState({
    value: '',
    label: '',
  })

  useEffect(() => {
    if (projects) {
      setProject({
        value: projects[0]?._id,
        label: projects[0]?.title,
      })
    }
  }, [])

  const [openEdit, setOpenEdit] = useState(false)

  const [openDetail, setOpenDetail] = useState(false)

  const [task, setTask] = useState('')

  const showEditor = (cell) => {
    setTask(cell.row.original)
    setOpenEdit(true)
  }

  const showDetail = (cell) => {
    setTask(cell.row.original)
    setOpenDetail(true)
  }

  const editTaskHandler = async (editedData) => {
    setOpenEdit(false)

    try {
      await editTask(editedData)

      toast.success('Task edited')
      setOpenEdit(false)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const deleteTaskHandler = async (cell) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTask(cell.row.original._id)
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  useEffect(() => {}, [openDetail])

  const columns2 = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ cell: { value } }) => {
          return <div className='font'>{value}</div>
        },
      },
      {
        Header: 'Priority',
        accessor: 'priority',
        Cell: ({ cell: { value } }) => {
          return <div className=''>{value}</div>
        },
      },

      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ cell: { value } }) => {
          return <div className=''>{value}</div>
        },
      },

      {
        Header: 'Created by',
        accessor: 'user',
        Cell: ({ cell: { value } }) => {
          return (
            <div className=''>
              {value.firstName} {value.lastName}
            </div>
          )
        },
      },
      {
        Header: 'Created at',
        accessor: 'createdAt',
        Cell: ({ cell: { value } }) => {
          return (
            <div>
              {DateTime.fromISO(value).toLocaleString(DateTime.Date_MED)}
            </div>
          )
        },
      },

      {
        Header: 'Due Date',
        accessor: 'dueDate',
        Cell: ({ cell: { value } }) => {
          return (
            <div className='font'>
              {DateTime.fromISO(value).toLocaleString(DateTime.Date_MED)}
            </div>
          )
        },
      },

      {
        Header: 'Assignee',
        accessor: 'assignee',
        Cell: ({ cell: { value } }) => {
          return (
            <div className='font'>
              {value?.firstName} {value?.lastName}
            </div>
          )
        },
      },

      {
        Header: 'Actions',
      },
    ],
    []
  )

  return (
    <div className='flex flex-col  bg-gray-100 w-full  border-l-2 h-screen pt-8  '>
      <div>
        {openDetail && (
          <TaskDetail
            task={task}
            open={openDetail}
            onClose={() => setOpenDetail(false)}
          />
        )}
      </div>
      <div>
        {openEdit && (
          <EditTask
            task={task}
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            editTaskHandler={editTaskHandler}
          />
        )}
      </div>

      <div>
        {projectsLoading ? (
          <ClipLoader
            color={'#0000FF'}
            loading={projectsLoading}
            //  cssOverride={override}
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        ) : error ? (
          <div className='danger'>{error?.tasks?.message || error.error}</div>
        ) : (
          <div className='flex flex-col gap-2 w-full  px-8   '>
            <label
              className='text-gray-500 font-semibold text-[14px]'
              htmlFor=''
            >
              Select project
            </label>

            <Select
              className='basic-single'
              classNamePrefix='select'
              name='project'
              value={project}
              options={projects.map((project) => {
                return {
                  value: project?._id,
                  label: project?.title,
                }
              })}
              onChange={(selectedOption) => {
                // setAssignee(selectedOption)

                setProject(selectedOption)
              }}
            />
          </div>
        )}

        {project.value === '' ? (
          <></>
        ) : isLoading ? (
          <ClipLoader
            color={'#0000FF'}
            loading={isLoading}
            //  cssOverride={override}
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        ) : error ? (
          <div className='danger'>{error?.tasks?.message || error.error}</div>
        ) : (
          <Table
            title={'Tasks'}
            columns={columns2}
            data={tasks.filter((task) => task.project === project.value)}
            showEditor={showEditor}
            deleteHandler={deleteTaskHandler}
            showDetail={showDetail}
            actionColIndex={7}
          />
        )}
      </div>
    </div>
  )
}

export default Tasks
