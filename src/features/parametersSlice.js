import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axios from "axios"

export const initialState = {
    parameters: [],
    status: 'idle',
    error: null
}

const PARAMETERS_URL = `https://timetable-generator-server.onrender.com/parameters`;

export const fetchAllParameters = createAsyncThunk('parameters/fetchAllParameters', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${PARAMETERS_URL}/`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const addParameter = createAsyncThunk('parameters/addParameter', async (body, thunkAPI) => {
    try {
        const response = await axios.post(`${PARAMETERS_URL}/`, body, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const deleteParameter = createAsyncThunk('parameters/deleteParameter', async ({ course }, thunkAPI) => {
    try {
        const response = await axios.delete(`${PARAMETERS_URL}/${course}`, {
            withCredentials: true,
        });

        return course;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const deleteBranch = createAsyncThunk('parameters/deleteBranch', async ({ course, branch }, thunkAPI) => {
    try {
        const response = await axios.delete(`${PARAMETERS_URL}/${course}/${branch}`, {
            withCredentials: true,
        });

        return { course, branch };

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const addBranch = createAsyncThunk('parameters/addBranch', async ({ course, body }, thunkAPI) => {
    try {
        const response = await axios.post(`${PARAMETERS_URL}/${course}`, body, {
            withCredentials: true,
        });

        return { course, body };

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);

    }
})

const handleRejected = (state, action) => {
    // state.status = 'failed';
    console.log(action.payload, 'error reject handle');
    state.error = action.payload;
};


const ParametersSlice = createSlice({
    name: 'parameters',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAllParameters.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.parameters = action.payload;
                state.error = null
            })
            .addCase(addParameter.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.parameters.push(action.payload);
                state.error = null
            })
            .addCase(deleteParameter.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.parameters = state.parameters.filter(param => param.course !== action.payload);
                state.error = null
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.parameters = state.parameters.map(param => {
                    if (param.course === action.payload.course) {
                        param.branches = param.branches.filter(branch => branch.name !== action.payload.branch);
                    }
                    return param;
                });
                state.error = null
            })
            .addCase(addBranch.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.parameters = state.parameters.map(param => {
                    if (param.course === action.payload.course) {
                        param.branches.push(action.payload.body);
                    }
                    return param;
                });
                state.error = null
            })
            .addMatcher(
                isAnyOf(
                    fetchAllParameters.pending,
                    addParameter.pending,
                    deleteParameter.pending,
                    deleteBranch.pending,
                    addBranch.pending
                ),
                (state) => {
                    // state.status = 'loading';
                }
            )
            .addMatcher(
                isAnyOf(
                    fetchAllParameters.rejected,
                    addParameter.rejected,
                    deleteParameter.rejected,
                    deleteBranch.rejected,
                    addBranch.rejected
                ),
                handleRejected
            );
    }
});



export function getAllParameters() {
    return useSelector(state => state.parameters.parameters)
}

export function getParametersError() {
    return useSelector(state => state.parameters.error)
}


export default ParametersSlice.reducer