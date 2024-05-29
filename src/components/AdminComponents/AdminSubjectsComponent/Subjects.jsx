import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { addSubject, deleteSubject, getSubjects, updateSubject } from '../../../features/subjectsSlice';
import SubjectForm from './SubjectForm';
import SubjectsTable from './SubjectsTable';
import SuccessComponent from '../../SuccessComponent';

const Subjects = () => {
    const { course, branch, semester } = useParams();
    const subjectsRes = getSubjects(course, branch, semester);
    const dispatch = useDispatch();


    const [error, setError] = useState('');

    let subjects = []
    if (subjectsRes.length > 0) {
        subjects = subjectsRes[0].subjects
    }

    const [successMsg, setSuccessMsg] = useState(null)


    async function handleAddSubject(subject) {
        let subjectCheckArr = subjects.filter(s => s.name.toLowerCase() == subject.toLowerCase());
        if (subjectCheckArr.length > 0) {
            setError('Subject already exists');
            setTimeout(() => {
                setError('');
            }, 3000);
        } else {
            const res = await dispatch(addSubject({ course, branch, semester, subject }));
            if (res.meta.requestStatus == 'fulfilled') {
                setSuccessMsg('subject added')
            } else if (res.meta.requestStatus == 'rejected') {
                setSuccessMsg(res.payload.message || "couldn't add subject")
            }
        }
    }

    async function handleDeleteSubject(id) {
        let res = await dispatch(deleteSubject({ course, branch, semester, id }));
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('subject deleted')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't delete subject")
        }
    }

    const editStart = (id) => {
        dispatch(updateSubject({ course, branch, semester, id, data: { isEditing: true } }));
    };

    const editDone = async (subject, id) => {
        let subjectCheckArr = subjects.filter(s => s.name === subject);
        if (subjectCheckArr.length > 0 && subjectCheckArr[0].id !== id) {
            console.log('Subject already exists');
        } else if (subject.length > 2) {
            let res = await dispatch(updateSubject({ course, branch, semester, id, data: { subject: subject, isEditing: false } }));
            if (res.meta.requestStatus == 'fulfilled') {
                setSuccessMsg('subject edited')
            } else if (res.meta.requestStatus == 'rejected') {
                setSuccessMsg(res.payload.message || "couldn't edit subject")
            }
        }
    };

    return (
        <Box sx={{ my: 4 }}>
            <Typography sx={{ fontSize: { xs: '1rem', sm: "1.25rem", md: '1.75rem' } }} gutterBottom>
                Subjects List for {semester} sem of {course} {branch}
            </Typography>
            <SubjectForm addSubject={handleAddSubject} error={error} />
            <SubjectsTable
                subjects={subjects}
                deleteSubject={handleDeleteSubject}
                editStart={editStart}
                editDone={editDone}
            />
            <SuccessComponent message={successMsg} />
        </Box>
    );
}

export default Subjects;
