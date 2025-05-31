import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import searchReducer from "./features/searchSlice";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { uploadApi } from "./services/uploadApi";
import { serviceApi } from "./services/serviceApi";
import { mailingApi } from "./services/mailingApi";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [mailingApi.reducerPath]: mailingApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      uploadApi.middleware,
      serviceApi.middleware,
      mailingApi.middleware,
    ]);
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
