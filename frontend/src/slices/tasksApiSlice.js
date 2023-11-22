// @ts-nocheck
import { TASK_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //MUTATIONS
    addTask: builder.mutation({
      /*
        NOTE: Brad uses some sample data hance no data is passed via body
            ->HOWEVER in our case, we will be passing the data thru req.body
    */
      query: (data) => ({
        url: `${TASK_URL}/${data.projectId}`,
        method: 'POST',
        body: data,
      }),
    }),
    editTask: builder.mutation({
      query: (data) => ({
        url: `${TASK_URL}/${data.taskId}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `${TASK_URL}/${taskId}`,
        method: 'DELETE',
      }),
      providesTags: ['Task'],
    }),

    //QUERIES

    getTasks: builder.query({
      query: () => ({
        url: TASK_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    getTask: builder.query({
      query: (taskId) => ({
        url: `${TASK_URL}/${taskId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getProjectTasks: builder.query({
      query: (projectId) => ({
        url: `${TASK_URL}/projectTasks/${projectId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getMyTasks: builder.query({
      query: () => ({
        url: `${TASK_URL}/myTasks}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
})

export const {
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useGetTaskQuery,
  useGetMyTasksQuery,
  useGetProjectTasksQuery
} = tasksApiSlice
