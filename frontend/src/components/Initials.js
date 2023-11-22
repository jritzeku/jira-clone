import React from 'react'

const Initials = ({ values }) => {
  return (
    <>
      <div className='flex items-center text-[12px] '>
        {values.map((person, idx = 0) => {
          if (idx < 2) {
            return (
              <span
                key={idx}
                className='ml-[-6px] inline-flex items-center justify-center w-6 h-6 text-xs font-bold   bg-gray-300 border-2 border-white rounded-full  p-3'
              >
                {person.firstName.slice(0, 1)}
                {person.lastName.slice(0, 1)}
              </span>
            )
          }
        })}
      </div>

      {values.length >= 3 && (
        <span className='text-gray-600 ml-[-6px] inline-flex items-center justify-center w-6 h-6 text-xs   bg-gray-300 border-2 border-white rounded-full  p-3'>
          <p>+</p>
          <p> {values.length - 2}</p>
        </span>
      )}
    </>
  )
}

export default Initials
