import Modal from 'components/modal/Modal'

import { AiOutlineClose } from 'react-icons/ai'

const TaskDetail = ({ open, onClose, task }) => {
  return (
    <Modal width={'800px'} open={open} onClose={onClose}>
      <>
        <div onClick={onClose} className='cursor-pointer ml-[90%]'>
          <AiOutlineClose />
        </div>

        <p className='text-xl font-semibold text-center '> Task Details</p>

        <div className='w-full  flex flex-col gap-8 items-center justify-center  bg-white   py-8'>
          {/* Title */}

          <div className='flex flex-col gap-2 w-full  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'>Title</p>

            <p>{task?.title}</p>
          </div>
          <div className='w-full flex flex-col gap-2  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'>
              Description
            </p>
            <p>{task?.description}</p>
          </div>

          <div className='w-full flex flex-col gap-2  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'>Priority</p>
            <p>{task?.priority}</p>
          </div>

          <div className='w-full flex flex-col gap-2  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'>Status</p>
            <p>{task?.status}</p>
          </div>

          <div className='w-full flex flex-col gap-2  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'>Assignee</p>
            {task?.assignee ? (
              <>
                <p>
                  {task.assignee.firstName} {task.assignee.lastName}
                </p>

                <p>Assignee Id: {task.assignee.id}</p>
              </>
            ) : (
              <p>No one assigned yet</p>
            )}
          </div>
        </div>
      </>
    </Modal>
  )
}

export default TaskDetail
