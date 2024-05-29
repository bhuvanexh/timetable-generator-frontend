import React from 'react'
import { useOutletContext } from 'react-router-dom'

const TeacherData = () => {
    const teacher = useOutletContext()
    console.log(teacher, 'hmmmm');
    return (
        <div>
            hmm
        </div>
    )
}

export default TeacherData



