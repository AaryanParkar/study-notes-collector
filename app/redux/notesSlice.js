//redux/notesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const noteSlice = createSlice({
  name: "note",
  initialState: [],
  reducers: {
    addNote: (state, action) => {
      state.push(action.payload);
    },
    // deleteNote: (state, action) => {
    //   const index = state.findIndex((note) => note.id === action.payload.id);
    //   if (index !== -1) {
    //     return state.splice(index, 1);
    //   }
    // },
    deleteNote: (state, action) => {
      const index = state.findIndex((note) => note.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { addNote, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
