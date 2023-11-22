// @ts-nocheck
import { useState } from 'react'
import { AiFillEye, AiOutlineEdit } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'
import { RiExpandUpDownFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { useFilters, useSortBy, useTable } from 'react-table'

export default function Table({
  title,
  columns,
  data,
  showEditor,
  deleteHandler,
  showDetail,
  actionColIndex,
}) {
  const [filterInput, setFilterInput] = useState('')
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  )

  const { userInfo } = useSelector((state) => state.auth)

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined
    setFilter('title', value)
    setFilterInput(value)
  }


  
  // Render the UI for your table
  return (
    <div>
      <div className='container mx-auto px-4 sm:px-8  '>
        <div className='py-8    '>
          <div>
            <h2 className='text-2xl font-semibold leading-tight'>{title}</h2>
          </div>

          {data.length === 0 ? (
            <p>No tasks exist </p>
          ) : (
            <>
              <input
                className='border-2 p-2 ml-2 rounded mt-4 mb-6 bg-gray-03'
                value={filterInput}
                onChange={handleFilterChange}
                placeholder={'Search title'}
              />

              <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto overflow-scroll   h-[600px]'>
                <table
                  className='mt-4 rounded-md min-w-full leading-normal relative   '
                  {...getTableProps()}
                >
                  <thead className='sticky top-[-20px]'>
                    {headerGroups.map((headerGroup, index) => (
                      <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                        {headerGroup.headers.map((column) => (
                          <th
                            className='px-5 py-3 border-b-2 border-gray-200 bg-blue-600 text-left text-[12px] font-semibold text-white uppercase tracking-wider  '
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            <div className='flex items-center gap-2'>
                              {column.render('Header')}
                              <span className='text-gray-300 text-[14px]'>
                                {column.render('Header').toString() !=
                                  'Actions' && <RiExpandUpDownFill />}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                      prepareRow(row)
                      return (
                        <tr
                          className='px-5 py-5 border-b border-gray-200 bg-white text-sm'
                          {...row.getRowProps()}
                        >
                          {row.cells.map((cell, i) => {
                            return i === actionColIndex ? (
                              <td className='flex gap-2 items-center ' key={i}>
                                <span
                                  onClick={() => showDetail(cell)}
                                  className='cursor-pointer px-4 py-1 text-purple-500 hover:bg-gray-100'
                                >
                                  <AiFillEye size={16} />
                                </span>

                                {userInfo?.data?.isAdmin && (
                                  <>
                                    <span
                                      onClick={() => showEditor(cell)}
                                      className='cursor-pointer px-4 py-1 border-2    text-green-800 rounded hover:bg-gray-100'
                                    >
                                      <AiOutlineEdit />
                                    </span>
                                    <span
                                      onClick={() => deleteHandler(cell)}
                                      className='cursor-pointer px-4 py-1 border-2  text-red-800 rounded hover:bg-gray-100'
                                    >
                                      <BsTrash />
                                    </span>
                                  </>
                                )}
                              </td>
                            ) : (
                              <td
                                className='px-5 py-3'
                                {...cell.getCellProps()}
                                key={i}
                              >
                                {cell.render('Cell')}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
