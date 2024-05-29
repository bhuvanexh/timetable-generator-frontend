import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axios from "axios"



export const initialState = {
    timetables: null,
    status: 'idle',
    error: null
}

const TIMETABLES_URL = `http://localhost:5000/timetables`;


export const fetchAllTimetables = createAsyncThunk('teachers/fetchAllTimetables', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${TIMETABLES_URL}/`, {
            withCredentials: true
        })
        return response.data

    } catch (error) {
        console.log(error, 'errr');
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const addAllTimetables = createAsyncThunk('teachers/addAllTimetables', async (timetables, thunkAPI) => {
    try {
        let body = []
        Object.keys(timetables).map(course => {
            Object.keys(timetables[course]).map(branch => {
                Object.keys(timetables[course][branch]).map(semester => {
                    Object.keys(timetables[course][branch][semester]).map(section => {
                        body.push({
                            course, branch, semester, section, timetable: timetables[course][branch][semester][section]
                        })
                    })
                })
            })
        })
        console.log(body, timetables, 'addd alll timetabless');
        const response = await axios.post(`${TIMETABLES_URL}/`, body, {
            withCredentials: true
        })

        return timetables

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
const timetablesSlice = createSlice({
    name: 'timetables',
    initialState,
    extraReducers(builder) {
        builder.addCase(fetchAllTimetables.pending, (state, action) => {
            // state.status = 'loading'
        }).addCase(fetchAllTimetables.fulfilled, (state, action) => {
            // state.status = 'succeeded';
            if (action.payload.length > 0) {
                let timetables = {}
                action.payload.forEach(obj => {
                    if (timetables[obj.course]) {
                        if (timetables[obj.course][obj.branch]) {
                            if (timetables[obj.course][obj.branch][obj.semester]) {
                                timetables[obj.course][obj.branch][obj.semester][obj.section] = obj.timetable
                            } else {
                                timetables[obj.course][obj.branch][obj.semester] = {}
                                timetables[obj.course][obj.branch][obj.semester][obj.section] = obj.timetable
                            }
                        } else {
                            timetables[obj.course][obj.branch] = {}
                            timetables[obj.course][obj.branch][obj.semester] = {}
                            timetables[obj.course][obj.branch][obj.semester][obj.section] = obj.timetable
                        }
                    } else {
                        timetables[obj.course] = {}
                        timetables[obj.course][obj.branch] = {}
                        timetables[obj.course][obj.branch][obj.semester] = {}
                        timetables[obj.course][obj.branch][obj.semester][obj.section] = obj.timetable
                    }
                })
                console.log(action.payload, timetables, 'kendrick just');
                state.timetables = timetables
                state.error = null
            }
        }).addCase(fetchAllTimetables.rejected, (state, action) => {
            // state.status = 'failed'
            state.error = action.payload.data
        }).addCase(addAllTimetables.pending, (state, action) => {
            // state.status = 'loading'
        }).addCase(addAllTimetables.fulfilled, (state, action) => {
            // state.status = 'succeeded';
            state.timetables = action.payload
            state.error = null
        }).addCase(addAllTimetables.rejected, (state, action) => {
            // state.status = 'failed'
            state.error = action.payload.data
        })
    }
})


export function getAllTimetables() {
    return useSelector(state => state.timetables.timetables)
}
export function getTimetable(course, branch, semester, section) {
    return useSelector(state => state.timetables.timetables[course][branch][semester][section])
}
export function getTimetableStatus() {
    return useSelector(state => state.timetables.status)
}
export function getTimetableErrors() {
    return useSelector(state => state.timetables.error)
}

export const { setTimetables, addTimetable, deleteTimetable } = timetablesSlice.actions

export default timetablesSlice.reducer