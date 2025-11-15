import { configureStore } from "@reduxjs/toolkit";
import tenantReducer from "./slices/tenantSlice";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import sourceReducer from "./slices/sourceSlice";
import postReducer from "./slices/postSlice";
import tagReducer from "./slices/tagSlice";
import crawlLogReducer from "./slices/crawlLogSlice";

export const store = configureStore({
  reducer: {
    tenant: tenantReducer,
    user: userReducer,
    category: categoryReducer,
    source: sourceReducer,
    post: postReducer,
    tag: tagReducer,
    crawlLog: crawlLogReducer,
  },
});

// RootState & AppDispatch cho TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
