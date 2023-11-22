// @ts-nocheck
import Board from 'components/board/Board'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { ClipLoader } from 'react-spinners'
import { useGetProjectsQuery } from 'slices/projectsApiSlice'
import {
  useDeleteTaskMutation,
  useEditTaskMutation,
  useGetProjectTasksQuery,
} from 'slices/tasksApiSlice'

const KanbanBoard = () => {
  const [project, setProject] = useState({
    value: '0',
    label: '',
  })

  const { data: projects, isLoading, error, refetch } = useGetProjectsQuery()
  const [projId, setProjId] = useState('')

  // const [editTask, { isLoading: loadingEdit }] = useEditTaskMutation()
  // const [deleteTask, { isLoading: loadingDelete }] = useDeleteTaskMutation()
  const { userInfo } = useSelector((state) => state?.auth)

  const [openEdit, setOpenEdit] = useState(false)

  return (
    <div className='flex flex-col  bg-gray-100 w-full  border-l-2 h-screen pt-8  '>
      <div className=''>
        {isLoading ? (
          <div className='flex items-center'>
            <ClipLoader
              color={'#0000FF'}
              loading={isLoading}
              //  cssOverride={override}
              size={150}
              aria-label='Loading Spinner'
              data-testid='loader'
            />
          </div>
        ) : error ? (
          <div className='danger'>
            {error?.projects?.message || error?.error}
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-2 w-[80%] px-8'>
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
                options={projects?.map((project) => {
                  return {
                    value: project?._id,
                    label: project?.title,
                  }
                })}
                onChange={(selectedOption) => {
                  setProject(selectedOption)

                  setProjId(selectedOption.value)
                }}
              />
            </div>
          </>
        )}
      </div>

      <div className=''>
        <div className='flex  gap-2 w-[80%]  px-8  '>
          {projId !== '' && (
            <Board
              projId={projId}
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default KanbanBoard
