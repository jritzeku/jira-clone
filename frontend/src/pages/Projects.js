// @ts-nocheck
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useDeleteProjectMutation,
  useEditProjectMutation,
  useGetProjectsQuery,
} from 'slices/projectsApiSlice'

import { DateTime } from 'luxon'
import { useMemo } from 'react'

import EditProject from 'components/EditProject'
import Initials from 'components/Initials'
import ProjectDetail from 'components/ProjectDetail'
import { toast } from 'react-toastify'
import { useGetUserQuery } from 'slices/usersApiSlice'
import Table from './Table'

import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

const Projects = () => {
  const { data: projects, isLoading, error, refetch } = useGetProjectsQuery()

  const [deleteProject, { isLoading: loadingDelete }] =
    useDeleteProjectMutation()

  const [editProject, { isLoading: loadingEdit }] = useEditProjectMutation()

  const { userInfo } = useSelector((state) => state.auth)

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetUserQuery(userInfo._id)

  const [openEdit, setOpenEdit] = useState(false)

  const [openDetail, setOpenDetail] = useState(false)

  const [project, setProject] = useState('')

  const showEditor = (cell) => {
    setProject(cell.row.original)
    setOpenEdit(true)
  }

  const showDetail = (cell) => {
    setProject(cell.row.original)
    setOpenDetail(true)
  }

  const editProjectHandler = async (editedData) => {
    try {
      await editProject(editedData)

      toast.success('Project edited')
      setOpenEdit(false)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const deleteProjectHandler = async (cell) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProject(cell.row.original._id)
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  useEffect(() => {}, [user])

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
        Header: 'Category',
        accessor: 'category',
        Cell: ({ cell: { value } }) => {
          return <div className='text-'>{value}</div>
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
        Header: 'Assignees',
        accessor: 'assignees',
        Cell: ({ cell: { value } }) => (
          <div className='flex items-center gap-1  '>
            <Initials values={value} />
          </div>
        ),
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
        Header: 'Actions',
      },
    ],
    []
  )
 

  return (
    <div className='flex flex-col  bg-gray-100 w-full  border-l-2 h-screen pt-8  '>
      <div>
        {openDetail && (
          <ProjectDetail
            project={project}
            open={openDetail}
            onClose={() => setOpenDetail(false)}
          />
        )}
      </div>
      <div>
        {openEdit && (
          <EditProject
            project={project}
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            editProjectHandler={editProjectHandler}
          />
        )}
      </div>

      {isLoading ? (
        <ClipLoader
          color={'#0000FF'}
          loading={isLoading}
          //  cssOverride={override}
          size={150}
          aria-label='Loading Spinner'
          data-testid='loader'
        />
      ) : error ? (
        <div className='danger'>{error?.projects?.message || error.error}</div>
      ) : (
        <Table
          title={'Projects'}
          columns={columns2}
          data={projects}
          showEditor={showEditor}
          deleteHandler={deleteProjectHandler}
          showDetail={showDetail}
          actionColIndex={5}
        />
      )}
    </div>
  )
}

export default Projects
