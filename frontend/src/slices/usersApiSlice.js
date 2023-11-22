import { apiSlice } from './apiSlice'
import { USER_URL } from '../constants'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //MUTATIONS
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/logout`,
        method: 'POST',
        body: data,
      }),
    }),
    editProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/editProfile`,
        method: 'PUT',
        body: data,
      }),
    }),

    editUser: builder.mutation({
    query: (data) => ({
        url: `${USER_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: 'DELETE',
      }),
    }),

    //QUERIES
    getUser: builder.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getUsers: builder.query({
      query: () => ({
        url: USER_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useEditProfileMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUsersQuery,
  useGetUserQuery,
} = usersApiSlice


 