import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

type User = {
	id: number;
	name: string;
	email: number;
};

export const userApi = createApi({
	reducerPath: "userApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/user`,
		prepareHeaders: (headers, { getState }) => {
			const token = localStorage.getItem("access-token");

			if (token) headers.set("Authorization", `Bearer ${token}`);

			return headers;
		},
	}),
	tagTypes: ["User"],
	endpoints: (builder) => ({
		getMe: builder.query({
			query: () => "me",
			providesTags: ["User"],
		}),
		getUser: builder.query({
			query: (id) => ({
				url: `/${id}`,
			}),
			providesTags: ["User"],
		}),
		getUsers: builder.query({
			query: ({ online, sex, city, minage, maxage, limit }) =>
				`?online=${online || ""}&sex=${sex || ""}&city=${city || ""}&minage=${minage || ""}&maxage=${maxage || ""}&limit=${limit || "16"}`,
			providesTags: ["User"],
		}),
		// createUser: builder.mutation({
		//   query: (body) => ({
		//     url: '',
		//     method: 'POST',
		//     body,
		//     formData: true
		//   }),
		//   invalidatesTags: ['User']
		// }),
		updateUser: builder.mutation({
			query: ({ id, body }) => ({
				url: `/${id}`,
				method: "PATCH",
				body,
				formData: true,
			}),
			invalidatesTags: ["User"],
		}),
		// removeUser: builder.mutation({
		//   query: (id) => ({
		//     url: `/${id}`,
		//     method: 'DELETE'
		//   }),
		//   invalidatesTags: ['User']
		// }),
		setActivity: builder.mutation({
			query: ({ id, body }) => ({
				url: `/${id}/activity`,
				method: "PATCH",
				body: body,
			}),
			invalidatesTags: ["User"],
		}),
		newVisit: builder.mutation({
			query: ({ id, body }) => ({
				url: `/${id}/visit`,
				method: "PATCH",
				body: body,
			}),
			invalidatesTags: ["User"],
		}),
		createNote: builder.mutation({
			query: ({ id, body }) => ({
				url: `/${id}/note`,
				method: "PATCH",
				body: body,
			}),
			invalidatesTags: ["User"],
		}),
		updateNote: builder.mutation({
			query: ({ id, body }) => ({
				url: `/${id}/note-update`,
				method: "PATCH",
				body: body,
			}),
			invalidatesTags: ["User"],
		}),
		deleteNote: builder.mutation({
			query: ({ id, body }) => ({
				url: `/${id}/note-delete`,
				method: "PATCH",
				body: body,
			}),
			invalidatesTags: ["User"],
		}),
	}),
});

export const {
	useGetMeQuery,
	useGetUserQuery,
	useGetUsersQuery,
	useUpdateUserMutation,
	useSetActivityMutation,
	useNewVisitMutation,
	useCreateNoteMutation,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
} = userApi;
