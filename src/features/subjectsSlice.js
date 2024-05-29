import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axios from "axios"
import { useMemo } from "react";


const initialState = {
    subjects: [],
    status: 'idle',
    error: null
}

const SUBJECTS_URL = `https://timetable-generator-server.onrender.com/subjects`;

export const fetchAllSubjects = createAsyncThunk('subjects/fetchSubjects', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${SUBJECTS_URL}/`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log(error, 'error');
        return thunkAPI.rejectWithValue('Fetch subjects request failed');
    }
})
export const addSubject = createAsyncThunk('subjects/addSubject', async ({ course, branch, semester, subject }, thunkAPI) => {
    try {
        const response = await axios.post(`${SUBJECTS_URL}/${course}/${branch}/${semester}`, { subject }, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log(error, 'error');
        return thunkAPI.rejectWithValue('add subjects request failed');
    }
})
export const updateSubject = createAsyncThunk('subjects/updateSubject', async ({ course, branch, semester, id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`${SUBJECTS_URL}/${course}/${branch}/${semester}/${id}`, { data }, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log(error, 'error');
        return thunkAPI.rejectWithValue('update subjects request failed');
    }
})
export const deleteSubject = createAsyncThunk('subjects/deleteSubject', async ({ course, branch, semester, id }, thunkAPI) => {
    try {
        const response = await axios.delete(`${SUBJECTS_URL}/${course}/${branch}/${semester}/${id}`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log(error, 'error');
        return thunkAPI.rejectWithValue('delete subjects request failed');
    }
})




const handlePending = (state) => {
    // state.status = 'loading';
};

const handleRejected = (state, action) => {
    // state.status = 'failed';
    state.error = action.payload;
};

const subjectsSlice = createSlice({
    name: 'subjects',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSubjects.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.subjects = action.payload;
                state.error = null
            })
            .addCase(addSubject.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                let done = false;
                state.subjects = state.subjects.map((subj) => {
                    if (
                        subj.course === action.payload.course &&
                        subj.branch === action.payload.branch &&
                        subj.semester === action.payload.semester
                    ) {
                        done = true;
                        return action.payload;
                    } else {
                        return subj;
                    }
                });
                if (!done) {
                    state.subjects.push(action.payload);
                }
                state.error = null
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.subjects = state.subjects.map((subj) => {
                    if (
                        subj.course === action.payload.course &&
                        subj.branch === action.payload.branch &&
                        subj.semester === action.payload.semester
                    ) {
                        return action.payload;
                    } else {
                        return subj;
                    }
                });
                state.error = null
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                // state.status = 'succeeded';

                state.subjects = state.subjects.map((subj) => {
                    if (
                        subj.course === action.payload.course &&
                        subj.branch === action.payload.branch &&
                        subj.semester === action.payload.semester
                    ) {
                        return action.payload;
                    } else {
                        return subj;
                    }
                });
                state.error = null
            })
            .addMatcher(
                isAnyOf(
                    fetchAllSubjects.pending,
                    addSubject.pending,
                    updateSubject.pending,
                    deleteSubject.pending
                ),
                handlePending
            )
            .addMatcher(
                isAnyOf(
                    fetchAllSubjects.rejected,
                    addSubject.rejected,
                    updateSubject.rejected,
                    deleteSubject.rejected
                ),
                handleRejected
            );
    }
});

export function getAllSubjects() {
    return useSelector(state => state.subjects.subjects)
}
export function getSubjectsStatus() {
    return useSelector(state => state.subjects.status)
}
export function getSubjectsError() {
    return useSelector(state => state.subjects.error)
}

export function getSubjects(course, branch, semester) {
    const subjects = useSelector(state => state.subjects.subjects);

    const filteredSubjects = useMemo(() => {
        return subjects.filter(subj => (subj.course == course && subj.branch == branch && subj.semester == semester));
    }, [subjects, course, branch, semester]);


    return filteredSubjects;
}



export default subjectsSlice.reducer