import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { deleteTeacher, editTeacher, getAllTeachers, registerTeacher } from '../../../features/teachersSlice';
import TeacherForm from './TeacherForm';
import TeachersTable from './TeachersTable';
import SuccessComponent from '../../SuccessComponent';

const AdminTeachersIndex = () => {
    const teachers = getAllTeachers();
    const dispatch = useDispatch();

    const [error, setError] = useState('');

    const [successMsg, setSuccessMsg] = useState(null)

    const handleAddTeacher = async (name, email, password) => {
        let teacherCheckArr = teachers.filter(t => (t.name.toLowerCase() == name.toLowerCase()) && t.email == email);
        if (teacherCheckArr.length > 0) {
            setError('Teacher already exists');
            setTimeout(() => {
                setError('');
            }, 3000);
        } else {
            let res = await dispatch(registerTeacher({ name, email, password }));
            if (res.meta.requestStatus == 'fulfilled') {
                setSuccessMsg('teacher added')
            } else if (res.meta.requestStatus == 'rejected') {
                setSuccessMsg(res.payload.message || "couldn't add teacher")
            }
        }
    };

    const handleDeleteTeacher = async (id) => {
        let res = await dispatch(deleteTeacher(id));
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('teacher deleted')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't add teacher")
        }
    };

    const editStart = (id) => {
        dispatch(editTeacher({ id, newData: { isEditing: true } }));
    };

    const editDone = async (name, id) => {
        let teacherCheckArr = teachers.filter(t => t.name === name);
        if (teacherCheckArr.length > 0 && teacherCheckArr[0].id !== id) {
            console.log('Name already exists');
        } else {
            let res = await dispatch(editTeacher({ id, newData: { name, isEditing: false } }));
            if (res.meta.requestStatus == 'fulfilled') {
                setSuccessMsg('teacher edited')
            } else if (res.meta.requestStatus == 'rejected') {
                setSuccessMsg(res.payload.message || "couldn't edit teacher")
            }
        }
    };

    return (
        <Box>
            <TeacherForm addTeacher={handleAddTeacher} error={error} setError={setError} />
            <TeachersTable teachers={teachers} deleteTeacher={handleDeleteTeacher} editStart={editStart} editDone={editDone} />
            <SuccessComponent message={successMsg} />
        </Box>
    );
};

export default AdminTeachersIndex;
