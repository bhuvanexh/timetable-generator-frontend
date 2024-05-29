import AdminIndex from "./components/AdminComponents/AdminIndex"
import AdminNav from "./components/AdminComponents/AdminNav"
import AdminSubjects from "./components/AdminComponents/AdminSubjectsComponent/AdminSubjects"
import AdminTeacher from "./components/AdminComponents/AdminTeacherComponents/AdminTeacher"
import AdminTeachers from "./components/AdminComponents/AdminTeacherComponents/AdminTeachers"
import AdminTeachersIndex from "./components/AdminComponents/AdminTeacherComponents/AdminTeachersIndex"
import Subjects from "./components/AdminComponents/AdminSubjectsComponent/Subjects"
import SubjectsIndex from "./components/AdminComponents/AdminSubjectsComponent/SubjectsIndex"
import Home from "./components/HomeComponents/Home"
import StudentIndex from "./components/StudentComponents/StudentIndex"
import StudentNav from "./components/StudentComponents/StudentNav"
import StudentTimetable from "./components/StudentComponents/StudentTimetable"
import TeacherData from "./components/TeacherComponent/TeacherData"
import TeacherIndex from "./components/TeacherComponent/TeacherIndex"
import TeacherNav from "./components/TeacherComponent/TeacherNav"
import Login from "./components/LoginComponents/Login"
import AdminLogin from "./components/LoginComponents/AdminLogin"
import AdminTimetable from "./components/AdminComponents/AdminTimetablesComponents/AdminTimetable"
import AdminTimetableIndex from "./components/AdminComponents/AdminTimetablesComponents/AdminTimetableIndex"
import AdminTimetableData from "./components/AdminComponents/AdminTimetablesComponents/AdminTimetableData"
import Navbar from "./components/Navbar"
import { Box } from "@mui/material"
import AdminTeachersVerify from "./components/AdminComponents/AdminTeacherComponents/AdminTeachersVerify"
import AdminParametersIndex from "./components/AdminComponents/AdminParameters/AdminParametersIndex"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path='/' element={<Navbar />} >
        <Route index element={<Home />} />
        <Route path='student' element={<StudentNav />} >
          <Route index element={<StudentIndex />} />
          <Route path=":course/:branch/:semester/:section" element={<StudentTimetable />} />
        </Route>
        <Route path='teacher' element={<TeacherNav />} >
          <Route index element={<TeacherIndex />} />
          {/* <Route path="data" element={<AdminTeacher />} /> */}
        </Route>
        <Route path='admin' element={<AdminNav />} >
          <Route index element={<AdminIndex />} />
          <Route path="parameters" element={<AdminParametersIndex />} />
          {/* <Route index element={<SubjectsIndex />} /> */}
          {/* </Route> */}
          <Route path="subjects" element={<AdminSubjects />} >
            <Route index element={<SubjectsIndex />} />
            <Route path=":course/:branch/:semester" element={<Subjects />} />
          </Route>
          <Route path="teachers" element={<AdminTeachers />} >
            <Route index element={<AdminTeachersIndex />} />
            <Route path="verify" element={<AdminTeachersVerify />} />
            <Route path=":id" element={<AdminTeacher />} />
          </Route>
          <Route path="timetables" element={<AdminTimetable />} >
            <Route index element={<AdminTimetableIndex />} />
            <Route path="data" element={<AdminTimetableData />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
      </Route>
    </>
  ))

  return (
    <>
      <Box component="main" sx={{ paddingTop: 10, paddingBottom: 1, minHeight: "100vh", bgcolor: "#E5E5E5" }}>
        <RouterProvider router={router} />
      </Box>
    </>
  )
}

export default App
