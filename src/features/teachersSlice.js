import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axios from "axios"





const initialState = {
    teachers: [],
    status: 'idle',
    error: null,
    currTeacher: null
}


const TEACHERS_URL = `http://localhost:5000/teachers`;


export const fetchTeacher = createAsyncThunk('teachers/fetchTeacher', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${TEACHERS_URL}/teacher`, {
            withCredentials: true
        })

        return response.data

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const teacherLogin = createAsyncThunk('teachers/teacherLogin', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${TEACHERS_URL}/login`, data, {
            withCredentials: true
        })
        if (response.data.teacher) {
            return response.data.teacher
        } else {
            return response.data
        }

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const adminLogin = createAsyncThunk('teachers/adminLogin', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${TEACHERS_URL}/login/admin`, data, {
            withCredentials: true
        })
        if (response.data.teacher) {
            return response.data.teacher
        } else {
            return response.data
        }

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const teacherLogOut = createAsyncThunk('teachers/teacherLogOut', async (_, thunkAPI) => {
    try {
        const response = await axios.post(`${TEACHERS_URL}/logout`, {}, {
            withCredentials: true
        })
        return response.data

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})
export const fetchAllTeachers = createAsyncThunk('teachers/fetchAllTeachers', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${TEACHERS_URL}/teachers`, {
            withCredentials: true
        })
        return response.data.teachers;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})

export const registerTeacher = createAsyncThunk('teachers/registerTeacher', async (body, thunkAPI) => {
    try {
        const response = await axios.post(`${TEACHERS_URL}/register`, body, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
})

export const deleteTeacher = createAsyncThunk('teachers/deleteTeacher', async (teacherId, thunkAPI) => {
    try {
        const response = await axios.delete(`${TEACHERS_URL}/${teacherId}`, {
            withCredentials: true,
        });

        return teacherId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
)

export const editTeacher = createAsyncThunk('teachers/editTeacher', async ({ id, newData }, thunkAPI) => {
    try {
        const response = await axios.put(`${TEACHERS_URL}/${id}`, newData, {
            withCredentials: true,
        });

        return response.data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
export const lockTeacherData = createAsyncThunk('teachers/lockTeacherData', async ({ id, newData }, thunkAPI) => {
    try {
        const response = await axios.put(`${TEACHERS_URL}/${id}/lock`, newData, {
            withCredentials: true,
        });


        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});


export const addTeacherData = createAsyncThunk('teachers/addTeacherData', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.post(`${TEACHERS_URL}/${id}/data`, data, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
);
export const addAllSchedules = createAsyncThunk('teachers/addAllSchedules', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${TEACHERS_URL}/update-schedule`, data, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
);


export const deleteTeacherData = createAsyncThunk('teachers/deleteTeacherData', async ({ teacherId, dataId }, thunkAPI) => {
    try {
        const response = await axios.delete(`${TEACHERS_URL}/${teacherId}/data/${dataId}`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
);
export const updateTeacherData = createAsyncThunk('teachers/updateTeacherData', async ({ teacherId, dataId, body }, thunkAPI) => {
    try {
        const response = await axios.put(`${TEACHERS_URL}/${teacherId}/data/${dataId}`, body, {
            withCredentials: true,
        });

        return response.data;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
);


const handleRejected = (state, action) => {
    console.log(action.payload, 'error reject handle');
    state.error = action.payload;
};

const teachersSlice = createSlice({
    name: 'teachers',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeacher.fulfilled, (state, action) => {
                // state.status = 'succeeded';
                state.currTeacher = action.payload;
                state.error = null
            })
            .addCase(registerTeacher.fulfilled, (state, action) => {
                state.teachers.push(action.payload.teacher);
                state.error = null
            })
            .addCase(deleteTeacher.fulfilled, (state, action) => {
                state.teachers = state.teachers.filter(teacher => teacher.id !== action.payload);
                state.error = null
            })
            .addCase(editTeacher.fulfilled, (state, action) => {
                state.teachers = state.teachers.map(teacher =>
                    teacher.id === action.payload.id ? action.payload : teacher
                );
                if (state.currTeacher.id == action.payload.id) {
                    state.currTeacher = { ...state.currTeacher, id: action.payload.id, teacher: action.payload }
                }
                state.error = null
            })
            .addCase(addTeacherData.fulfilled, (state, action) => {
                state.teachers = state.teachers.map(teacher =>
                    teacher.id === action.payload.id ? action.payload : teacher
                );
                if (state.currTeacher.id == action.payload.id) {
                    state.currTeacher = { ...state.currTeacher, id: action.payload.id, teacher: action.payload }
                }
                state.error = null
            })
            .addCase(deleteTeacherData.fulfilled, (state, action) => {
                state.teachers = state.teachers.map(teacher =>
                    teacher.id === action.payload.id ? action.payload : teacher
                );
                if (state.currTeacher.id == action.payload.id) {
                    state.currTeacher = { ...state.currTeacher, id: action.payload.id, teacher: action.payload }
                }
                state.error = null
            })
            .addCase(fetchAllTeachers.fulfilled, (state, action) => {
                state.teachers = action.payload;
                state.error = null
            })
            .addCase(teacherLogin.fulfilled, (state, action) => {
                state.currTeacher = action.payload;
                state.error = null
            })
            .addCase(teacherLogOut.fulfilled, (state) => {
                state.currTeacher = null;
                state.error = null
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.currTeacher = action.payload;
                state.error = null
            })
            .addCase(lockTeacherData.fulfilled, (state, action) => {
                state.teachers = state.teachers.map(teacher =>
                    teacher.id === action.payload.id ? action.payload : teacher
                );
                if (state.currTeacher.id == action.payload.id) {
                    state.currTeacher = { ...state.currTeacher, id: action.payload.id, teacher: action.payload }
                }
                state.error = null
            })
            .addCase(addAllSchedules.fulfilled, (state, action) => {
                state.teachers = action.payload.teachers;
                state.error = null
            })
            .addCase(updateTeacherData.fulfilled, (state, action) => {
                state.teachers = state.teachers.map(teacher =>
                    teacher.id === action.payload.id ? action.payload : teacher
                );
                if (state.currTeacher.id == action.payload.id) {
                    state.currTeacher = { ...state.currTeacher, id: action.payload.id, teacher: action.payload }
                }
                state.error = null
            })
            .addMatcher(
                isAnyOf(
                    fetchTeacher.rejected, registerTeacher.rejected, deleteTeacher.rejected, editTeacher.rejected,
                    addTeacherData.rejected, deleteTeacherData.rejected, fetchAllTeachers.rejected, teacherLogin.rejected,
                    teacherLogOut.rejected, adminLogin.rejected, lockTeacherData.rejected, addAllSchedules.rejected, updateTeacherData.rejected
                ),
                handleRejected
            );
    }
});





export function getAllTeachers() {
    return useSelector(state => state.teachers.teachers)
}
export function getCurrTeacher() {
    return useSelector(state => state.teachers.currTeacher)
}
export function getTeacherById(id) {
    return useSelector(state => {
        const teacher = state.teachers.teachers.find(t => t.id == id);
        return teacher
    });
}
export function getTeachersStatus() {
    return useSelector(state => state.teachers.status)
}
export function getTeachersError() {
    return useSelector(state => state.teachers.error)
}

export default teachersSlice.reducer