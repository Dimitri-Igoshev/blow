import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.API_URL}/chat` }),
  tagTypes: ["Chats", "Messages"],
  endpoints: (build) => ({
    getChats: build.query({
      query: (userId) => `/${userId}`,
      providesTags: ["Chats", "Messages"],
    }),
    sendMessage: build.mutation({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats", "Messages"],
    }),
    startChat: build.mutation({
      query: (body) => ({
        url: "chat",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats", "Messages"],
    }),
    getChatMessages: build.query({
      query: (chatId) => `${chatId}/messages`,
      providesTags: ["Chats", "Messages"],
    }),
    updateMessage: build.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteMessage: build.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    subscribe: build.query({
      queryFn: async () => ({ data: [] }), // данные придут через сокет
      providesTags: ["Messages", "Chats"],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useSendMessageMutation,
  useGetChatMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useSubscribeQuery,
  useStartChatMutation,
} = chatApi;
