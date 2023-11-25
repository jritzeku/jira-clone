// @ts-nocheck

import EditTask from 'components/EditTask'
import TaskDetail from 'components/TaskDetail'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { AiFillEye, AiOutlineEdit } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import showToast from 'utils/showToast'
import uuid from 'uuid/v4'

import {
  useDeleteTaskMutation,
  useEditTaskMutation,
  useGetProjectTasksQuery,
} from 'slices/tasksApiSlice'
import { ClipLoader } from 'react-spinners'

const Board = ({ projId, openEdit, setOpenEdit }) => {
  const [task, setTask] = useState('')
  const [columns, setColumns] = useState({})
  const [openDetail, setOpenDetail] = useState(false)

  const { userInfo } = useSelector((state) => state?.auth)

  const showDetail = (task) => {
    setTask(task)
    setOpenDetail(true)
  }

  const showEditor = (task) => {
    setTask(task)
    setOpenEdit(true)
  }

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: tasksRefetch,
  } = useGetProjectTasksQuery(projId)

  const [editTask, { isLoading: loadingEdit }] = useEditTaskMutation()
  const [deleteTask, { isLoading: loadingDelete }] = useDeleteTaskMutation()

  const editTaskHandler = async (editedData) => {
  //  console.log('Inside editTaskHandler')
    setOpenEdit(false)

    try {
      let res = await editTask(editedData)
      if (res.data) {
        tasksRefetch()
      }
    } catch (err) {}
  }

  const deleteTaskHandler = async (task) => {
    if (window.confirm('Are you sure?')) {
      try {
        let res = await deleteTask(task._id)
        if (res.data) {
          tasksRefetch()
        }
      } catch (err) {}
    }
  }

  useEffect(() => {
    setColumns({
      [uuid()]: {
        name: 'Not Started',

        items: userInfo.data.isAdmin
          ? tasks?.filter((t) => t.status === 'not started')
          : tasks?.filter(
              (t) =>
                t.status === 'not started' &&
                t.assignee.id === userInfo.data._id
            ),
      },

      [uuid()]: {
        name: 'In Progress',
        items: userInfo.data.isAdmin
          ? tasks?.filter((t) => t.status === 'in progress')
          : tasks?.filter(
              (t) =>
                t.status === 'in progress' &&
                t.assignee.id === userInfo.data._id
            ),
      },
      [uuid()]: {
        name: 'In Review',
        items: userInfo.data.isAdmin
          ? tasks?.filter((t) => t.status === 'in review')
          : tasks?.filter(
              (t) =>
                t.status === 'in review' && t.assignee.id === userInfo.data._id
            ),
      },
      [uuid()]: {
        name: 'Completed',
        items: userInfo.data.isAdmin
          ? tasks?.filter((t) => t.status === 'completed')
          : tasks?.filter(
              (t) =>
                t.status === 'completed' && t.assignee.id === userInfo.data._id
            ),
      },
    })
  }, [tasks, projId])

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result

    if (
      destination.droppableId.toString() ===
        Object.keys(columns)[3].toString() &&
      !userInfo.data.isAdmin
    ) {
      showToast(
        " Only admins can move task to columns 'InReview' and 'Completed'  "
      )

      return
    }

    //VALID action
    if (source.droppableId !== destination.droppableId) {
      //column we are removing from and dropping to
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]

      //the items in the respective columns
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]

      //the item that is removed from sourceCol and to be moved to destCol
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)

      if (removed.assignee.id !== userInfo.data._id && !userInfo.data.isAdmin) {
        //   toast("You can not drag/drop other assignee's tasks ")
        showToast("You can not drag/drop other assignee's tasks ")
        return
      }

      const editedData = {
        taskId: removed.id,
        status: destColumn.name.toLowerCase(),
      }

      editTaskHandler(editedData)

      //without this it work sbut is glitchy...when dragging to destination goes back to
      //sourceColumn first and then to destinationColumn after re-render
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      //INVALID action; cant drag to same position it is already in
      const column = columns[source.droppableId]
      const copiedItems = [...column?.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  return tasksLoading ? (
    <div className='flex items-center absolute '>
      <ClipLoader
        color={'#0000FF'}
        loading={tasksLoading}
        //  cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  ) : tasksError ? (
    <div className='danger'>
      {tasksError?.tasks?.message || tasksError?.error}
    </div>
  ) : (
    <div className='flex flex-col gap-4'>
      <div>
        {openDetail && (
          <TaskDetail
            task={task}
            open={openDetail}
            onClose={() => setOpenDetail(false)}
          />
        )}

        {openEdit && (
          <EditTask
            task={task}
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            editTaskHandler={editTaskHandler}
          />
        )}
      </div>

      <div className='pt-5 flex items-center gap-2   justify-around  '>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns)?.map(([columnId, column], index) => {
            return (
              <div
                className='flex flex-col items-center  h-[500px] '
                key={columnId}
              >
                <h2 className=' py-2 font-bold bg-blue-600 text-[14px] text-white w-full text-center'>
                  {column.name}
                  <span className='ml-1'> ({column?.items?.length}) </span>
                </h2>

                <div className=' overflow-scroll' style={{ margin: 0 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`p-4 w-[250px] min-h-[500px] ${
                            snapshot.isDraggingOver
                              ? 'bg-blue-200'
                              : 'bg-gray-200'
                          }`}
                        >
                          {column?.items?.map((item, index) => {
                            return (
                              <Draggable
                                key={item?.id}
                                draggableId={item?.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`flex flex-col gap-6 p-4 mb-[8px] min-h-[50px]  ${
                                        snapshot.isDragging
                                          ? 'bg-gray-100'
                                          : 'bg-white'
                                      }

                                      ${
                                        item.priority === 'low'
                                          ? 'border-l-4 border-green-500'
                                          : item.priority === 'medium'
                                          ? 'border-l-4 border-yellow-500'
                                          : 'border-l-4 border-red-500'
                                      }


                                      `}
                                    >
                                      <div className='flex items-center justify-between text-[12px]  '>
                                        <p className='font-bold  '>
                                          {item.title}{' '}
                                        </p>
                                      </div>

                                      <div>
                                        <p className='text-[12px]'>
                                          Priority:{' '}
                                          <span
                                            className={`${
                                              item.priority === 'low'
                                                ? 'text-green-600'
                                                : item.priority === 'medium'
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                            } `}
                                          >
                                            {item.priority}
                                          </span>{' '}
                                        </p>
                                      </div>

                                      <div className='flex items-center justify-between text-[12px]  '>
                                        <span className='ml-[-6px] inline-flex items-center justify-center w-8 h-8 text-xs font-bold   bg-gray-300 border-2 border-white rounded-full  p-3'>
                                          {item.assignee.firstName.slice(0, 1)}
                                          {item.assignee.lastName.slice(0, 1)}
                                        </span>

                                        <div className='flex items-center gap-3'>
                                          <span
                                            onClick={() => showDetail(item)}
                                            className='cursor-pointer  py-1 text-purple-400 hover:bg-gray-100'
                                          >
                                            <AiFillEye size={16} />
                                          </span>

                                          {userInfo?.data?.isAdmin && (
                                            <>
                                              <span
                                                onClick={() => {
                                                  showEditor(item)
                                                }}
                                                className='cursor-pointer py-1 text-green-700 hover:bg-gray-100'
                                              >
                                                <AiOutlineEdit size={16} />
                                              </span>

                                              <span
                                                onClick={() =>
                                                  deleteTaskHandler(item)
                                                }
                                                className='cursor-pointer py-1 text-red-700 hover:bg-gray-100'
                                              >
                                                <BsTrash size={16} />
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </div>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  )
}

export default Board
