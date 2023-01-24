import { configureStore } from "@reduxjs/toolkit"
import puzzleReducer from 'slide_puzzle/puzzleSlice'

export const store=configureStore({
    reducer:{
        puzzle:puzzleReducer,
    },
})