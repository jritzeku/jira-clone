// @ts-nocheck
import { PROJECT_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //QUERIES

    getProject: builder.query({
      query: (projectId) => ({
        url: `${PROJECT_URL}/${projectId}`,
      }),
      // keepUnusedDataFor: 5,p
    }),

    getProjects: builder.query({
      query: () => ({
        url: PROJECT_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    getMyProjects: builder.query({
      query: () => ({
        url: `${PROJECT_URL}/myProjects}`,
      }),
      keepUnusedDataFor: 5,
    }),

    //MUTATIONS
    addProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECT_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    editProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECT_URL}/${data.projectId}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `${PROJECT_URL}/${projectId}`,
        method: 'DELETE',
      }),
      providesTags: ['Project'],
    }),
  }),
})

export const {
  useAddProjectMutation,
  useEditProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
} = projectsApiSlice
