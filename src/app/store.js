import { configureStore } from '@reduxjs/toolkit'
import parametersReducer from '../features/parametersSlice'
import subjectsReducer from '../features/subjectsSlice'
import teachersReducer from '../features/teachersSlice'
import timetablesReducer from '../features/timetablesSlice'
export const store = configureStore({
    reducer: {
        teachers: teachersReducer,
        timetables: timetablesReducer,
        subjects: subjectsReducer,
        parameters: parametersReducer
    }
})