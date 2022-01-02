import { configureStore } from "@reduxjs/toolkit";

import { middleware, reducer, reducerPath } from "./api";

export const store = configureStore({
    reducer: {
        [reducerPath]: reducer
    },
    middleware: (getDefault) => getDefault().concat(middleware)
});
