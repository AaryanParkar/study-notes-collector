// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notesSlice";
import menuReducer from "./menuSlice";

export const store = configureStore({
    reducer: {
        notes: notesReducer,
        menu: menuReducer,
    },
});

