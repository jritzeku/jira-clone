import Modal from 'components/modal/Modal'
import { AiOutlineClose } from 'react-icons/ai'

const ProjectDetail = ({ open, onClose, project }) => {
 

  return (
    <Modal width={'800px'} open={open} onClose={onClose}>
      <>
        <div onClick={onClose} className='cursor-pointer ml-[90%]'>
          <AiOutlineClose />
        </div>

        <p className='text-xl font-semibold text-center  '> Project Detail</p>

        <div className='w-full  flex flex-col gap-8 items-center justify-center  bg-white   py-8'>
          {/* Title */}

          <div className='flex flex-col gap-2 w-full  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'>Title</p>

            <p>{project?.title}</p>
          </div>

          <div className='w-full flex flex-col gap-2  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'  >
              Category
            </p>
            <p>{project?.category}</p>
          </div>

          <div className='w-full flex flex-col gap-2  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]' >
              Description
            </p>
            <p>{project?.description}</p>
          </div>

          <div className='w-full flex flex-col gap-2  px-8'>
            <p className='text-gray-500 font-semibold text-[14px]'  >
              Assignees
            </p>
            {project?.assignees.length > 0 ? (
              <p>
                {project?.assignees?.map((assignee) => {
                  return <p>{assignee.firstName}</p>
                })}
              </p>
            ) : (
              <p>No one assigned yet</p>
            )}
          </div>
        </div>
      </>
    </Modal>
  )
}

export default ProjectDetail
