import { configureStore } from "@reduxjs/toolkit";

import { middleware, reducer, reducerPath } from "./api";
import { selectionSlice } from "./reducers/selectionReducer";

export const store = configureStore({
    reducer: {
        [reducerPath]: reducer,
        [selectionSlice.name]: selectionSlice.reducer
    },
    middleware: (getDefault) => getDefault().concat(middleware)
});
