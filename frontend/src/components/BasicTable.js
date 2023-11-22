import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

export default function BasicTable({ data, columns }) {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  })

  return (
    <div className='container mx-auto px-4 sm:px-8'>
      <div className='py-8'>
        <div>
          <h2 className='text-2xl font-semibold leading-tight'>Invoices</h2>
        </div>
        <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
          <div className='inline-block min-w-full shadow-md rounded-lg overflow-hidden'>
            <table className='min-w-full leading-normal'>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {
                              { asc: '🔼', desc: '🔽' }[
                                header.column.getIsSorted() ?? null
                              ]
                            }
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className='px-5 py-5 border-b border-gray-200 bg-white text-sm'
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className='px-5 py-3' key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination code */}
      {/* <div 
      className='my-5'
      >
          <button onClick={() => table.setPageIndex(0)}>First page</button>
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous page
          </button>
          <button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next page
          </button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
            Last page
          </button>
        </div> */}

      <div className='px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          '>
        <span className='text-xs xs:text-sm text-gray-900'>
          Showing 1 to 4 of 50 Entries
        </span>
        <div className='inline-flex mt-2  gap-1'>
          <button
            className='text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-l'
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous page
          </button>
          <button
            className='text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-l'
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next page
          </button>
        </div>
      </div>
    </div>
  )
}

/*

NOTES: 




-Styling example via tailwind 

https://codepen.io/superfly/pen/wvvPLZB


-Other examples of Tanstack tables: 

https://blog.logrocket.com/react-table-complete-guide/
https://github.com/learnwithparam/logrocket-smart-table




*/
