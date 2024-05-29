export function constraintCheckTeacherData({ subject, semester, branch, course }, teachers) {
    if (!subject || !semester || !course || !branch) {
        return false
    }

    let checkArr = teachers.filter(t => {
        let inCheckArr = t.teacherData.filter(d => {
            return (d.subject == subject) && (d.semester == semester) && (d.course == course) && (d.branch == branch)
        })
        return inCheckArr.length > 0
    })


    return checkArr
}



export function generateTimetables(teachers, parameters) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30"];

    const reverseTimeSlots = [...timeSlots].reverse();
    const reverseDaysOfWeek = [...daysOfWeek].reverse();


    // teacher schedules

    let teachersSchedules = {}

    teachers.forEach(teacher => {
        teachersSchedules[teacher.name] = {}
        daysOfWeek.forEach(day => {
            teachersSchedules[teacher.name][day] = {}
            timeSlots.forEach(slot => {
                teachersSchedules[teacher.name][day][slot] = null;
            });
        });
    })

    // Initialize initial timetable object
    const initialTimetableObj = {};


    parameters.forEach(p => {
        initialTimetableObj[p.course] = {};
        p.branches.forEach(branch => {
            initialTimetableObj[p.course][branch.name] = {};
            [...Array(Number(p.semesters))].map((_, index) => {
                initialTimetableObj[p.course][branch.name][`${index + 1}`] = {};
                [...Array(Number(branch.sections))].map((_, i) => {
                    initialTimetableObj[p.course][branch.name][`${index + 1}`][`${i + 1}`] = {};
                    daysOfWeek.forEach(day => {
                        initialTimetableObj[p.course][branch.name][`${index + 1}`][`${i + 1}`][day] = {};
                        timeSlots.forEach(slot => {
                            initialTimetableObj[p.course][branch.name][`${index + 1}`][`${i + 1}`][day][slot] = null;
                        });
                    });
                })
            })
        });
    });

    // Initialize lecture and lab counts
    const lectureCount = {};
    const labCount = {};
    parameters.forEach(p => {
        lectureCount[p.course] = {};
        labCount[p.course] = {};
        p.branches.forEach(branch => {
            lectureCount[p.course][branch.name] = {};
            labCount[p.course][branch.name] = {};
            [...Array(Number(p.semesters))].map((_, index) => {
                lectureCount[p.course][branch.name][`${index + 1}`] = {};
                labCount[p.course][branch.name][`${index + 1}`] = {};
                [...Array(Number(branch.sections))].map((_, i) => {
                    lectureCount[p.course][branch.name][`${index + 1}`][`${i + 1}`] = 0;
                    labCount[p.course][branch.name][`${index + 1}`][`${i + 1}`] = 0;
                })
            })
        });
    });


    // Calculate lecture and lab counts
    teachers.forEach(teacher => {
        teacher.teacherData.forEach(subject => {
            lectureCount[subject.course][subject.branch][subject.semester][subject.section] += Number(subject.lectures);
            labCount[subject.course][subject.branch][subject.semester][subject.section] += Number(subject.labs);
        });
    });


    // Insert vacant lectures

    let maxClassesCheck = []
    parameters.forEach(p => {
        p.branches.forEach(branch => {
            [...Array(Number(p.semesters))].map((_, index) => {
                [...Array(Number(branch.sections))].map((_, i) => {
                    let totalSlots = daysOfWeek.length * timeSlots.length;
                    let vacantSlots = totalSlots - (lectureCount[p.course][branch.name][`${index + 1}`][`${i + 1}`] + labCount[p.course][branch.name][`${index + 1}`][`${i + 1}`]);
                    if (vacantSlots > 0) {
                        reverseTimeSlots.forEach(slot => {
                            reverseDaysOfWeek.forEach(day => {
                                if (vacantSlots > 0) {
                                    initialTimetableObj[p.course][branch.name][`${index + 1}`][`${i + 1}`][day][slot] = 'vacant';
                                    vacantSlots--;
                                }
                            });
                        });
                    } else {
                        maxClassesCheck.push({
                            course: p.course, branch: branch.name, semester: `${index + 1}`, section: `${i + 1}`
                        })
                    }
                });
            })
        })
    });


    //  trial 2 
    teachers.forEach(teacher => {
        let teacherSchedule = teachersSchedules[teacher.name];
        teacher.teacherData.forEach(subject => {
            if (!subject.checked) {
                return
            }

            let labsRemaining = Number(subject.labs);
            let course = subject.course
            let semester = subject.semester
            let branch = subject.branch
            let section = subject.section

            // console.log(subject, 'subject from iteration');

            // labs
            daysOfWeek.forEach(day => {
                if (labsRemaining > 0 && !teacherSchedule[day]["12:30-1:30"] && (!initialTimetableObj[course][branch][semester][section][day]["12:30-1:30"] || initialTimetableObj[course][branch][semester][section][day]["12:30-1:30"] == 'vacant')) {
                    teacherSchedule[day]["12:30-1:30"] = { course, branch, semester, section, subject: subject.subject, type: 'lab' };
                    initialTimetableObj[course][branch][semester][section][day]["12:30-1:30"] = { teacher: teacher.name, subject: subject.subject, type: 'lab' };
                    labsRemaining--;
                }
            })
            reverseTimeSlots.forEach(slot => {
                daysOfWeek.forEach(day => {
                    let timetableEntry = initialTimetableObj[course][branch][semester][section][day][slot]
                    if (labsRemaining > 0 && !teacherSchedule[day][slot] && !timetableEntry) {
                        teacherSchedule[day][slot] = { course, branch, semester, section, subject: subject.subject, type: 'lab' };
                        initialTimetableObj[course][branch][semester][section][day][slot] = { teacher: teacher.name, subject: subject.subject, type: 'lab' };
                        labsRemaining--;
                    }
                })
            })

            if (labsRemaining > 0) {
                reverseTimeSlots.forEach(slot => {
                    daysOfWeek.forEach(day => {
                        let timetableEntry = initialTimetableObj[course][branch][semester][section][day][slot]
                        if (labsRemaining > 0 && !timetableEntry && teacherSchedule[day][slot]) {
                            reverseTimeSlots.forEach(slotInner => {
                                daysOfWeek.forEach(dayInner => {
                                    let timetableEntryInner = initialTimetableObj[course][branch][semester][section][dayInner][slotInner]
                                    if (timetableEntryInner && timetableEntryInner.type == 'lab' && timetableEntryInner.teacher != teacher.name && !teacherSchedule[dayInner][slotInner]) {
                                        let newTname = timetableEntryInner.teacher
                                        let newTelement = timetableEntryInner
                                        if (!teachersSchedules[newTname][day][slot]) {
                                            teachersSchedules[newTname][day][slot] = { course, branch, semester, section, subject: newTelement.subject, type: 'lab' }
                                            initialTimetableObj[course][branch][semester][section][day][slot] = { teacher: newTname, subject: newTelement.subject, type: 'lab' }
                                            teachersSchedules[newTname][dayInner][slotInner] = null
                                            teacherSchedule[dayInner][slotInner] = { course, branch, semester, section, subject: subject.subject, type: 'lab' }
                                            initialTimetableObj[course][branch][semester][section][dayInner][slotInner] = { teacher: teacher.name, subject: subject.subject, type: 'lab' }
                                            labsRemaining--
                                        }
                                    }
                                })
                            })
                        }
                    })
                })
            }
            if (labsRemaining > 0) {
                reverseTimeSlots.forEach(slot => {
                    daysOfWeek.forEach(day => {
                        let timetableEntry = initialTimetableObj[course][branch][semester][section][day][slot]
                        if (labsRemaining > 0 && timetableEntry == 'vacant' && !teacherSchedule[day][slot]) {
                            initialTimetableObj[course][branch][semester][section][day][slot] = { teacher: teacher.name, subject: subject.subject, type: 'lab' };
                            labsRemaining--
                        }
                    })
                })
            }
            if (labsRemaining > 0) {
                console.log('couldnt labs');
            }

        });
    });

    // lectures
    teachers.forEach(teacher => {
        let teacherSchedule = teachersSchedules[teacher.name];
        teacher.teacherData.forEach(subject => {
            if (!subject.checked) {
                return
            }
            let course = subject.course
            let semester = subject.semester
            let branch = subject.branch
            let section = subject.section

            let lecturesRemaining = Number(subject.lectures);
            let morningSlotScheduled = false;
            daysOfWeek.forEach(day => {
                if (lecturesRemaining <= 0) {
                    return
                }
                let lectureScheduled = false;
                timeSlots.forEach(slot => {
                    if ((slot == '9:30-10:30' && morningSlotScheduled) || lectureScheduled) {
                        return
                    }
                    let timetableEntry = initialTimetableObj[course][branch][semester][section][day][slot]
                    if (!teacherSchedule[day][slot] && !timetableEntry) {
                        teacherSchedule[day][slot] = { course, branch, semester, section, subject: subject.subject, type: 'lecture' };
                        initialTimetableObj[course][branch][semester][section][day][slot] = { teacher: teacher.name, subject: subject.subject, type: 'lecture' };
                        lectureScheduled = true;
                        if (slot == '9:30-10:30') {
                            morningSlotScheduled = true
                        }
                        lecturesRemaining--;
                    }
                });
            });

            // console.log(lecturesRemaining, 'remaining for', teacher.name, subject.subject, course, semester);

            if (lecturesRemaining > 0) {

                daysOfWeek.forEach(day => {

                    if (lecturesRemaining <= 0) {
                        return
                    }
                    timeSlots.forEach(slot => {
                        let timetableEntry = initialTimetableObj[course][branch][semester][section][day][slot]
                        if (slot == '9:30-10:30' || lecturesRemaining <= 0 || timetableEntry) {
                            return
                        }


                        daysOfWeek.forEach(dayInner => {
                            timeSlots.forEach(slotInner => {
                                let timetableEntryInner = initialTimetableObj[course][branch][semester][section][dayInner][slotInner]
                                if (slot == '9:30-10:30' || lecturesRemaining <= 0 || timetableEntry || !timetableEntryInner) {
                                    return
                                }
                                if (timetableEntryInner.type == 'lecture' && timetableEntryInner.teacher != teacher.name && !teacherSchedule[dayInner][slotInner]) {
                                    let newTname = timetableEntryInner.teacher
                                    if (teachersSchedules[newTname][day][slot]) {
                                        return
                                    }
                                    let newTelement = timetableEntryInner
                                    let alreadyClass = false
                                    let alreadyClassNewT = false
                                    for (const slots in teacherSchedule[dayInner]) {
                                        let teacherScheduleInnerEntry = teacherSchedule[dayInner][slots]
                                        if (!teacherScheduleInnerEntry) {
                                            continue
                                        }
                                        if (teacherScheduleInnerEntry.course == course && teacherScheduleInnerEntry.branch == branch && teacherScheduleInnerEntry.semester == semester && teacherScheduleInnerEntry.section == section && teacherScheduleInnerEntry.subject == subject.subject && teacherScheduleInnerEntry.type == 'lecture') {
                                            alreadyClass = true
                                        }
                                    }
                                    for (const slots in teachersSchedules[newTname][day]) {
                                        let teacherScheduleInnerEntry = teachersSchedules[newTname][day][slots]
                                        if (!teacherScheduleInnerEntry) {
                                            continue
                                        }
                                        if (teacherScheduleInnerEntry.course == course && teacherScheduleInnerEntry.branch == branch && teacherScheduleInnerEntry.semester == semester && teacherScheduleInnerEntry.section == section && teacherScheduleInnerEntry.subject == newTelement.subject && teacherScheduleInnerEntry.type == 'lecture') {
                                            alreadyClassNewT = true
                                        }
                                    }
                                    if (!alreadyClass && !alreadyClassNewT) {
                                        teachersSchedules[newTname][day][slot] = { course, branch, semester, section, subject: newTelement.subject, type: 'lecture' }
                                        initialTimetableObj[course][branch][semester][section][day][slot] = { teacher: newTname, subject: newTelement.subject, type: 'lecture' }
                                        teachersSchedules[newTname][dayInner][slotInner] = null
                                        teacherSchedule[dayInner][slotInner] = { course, branch, semester, section, subject: subject.subject, type: 'lecture' }
                                        initialTimetableObj[course][branch][semester][section][dayInner][slotInner] = { teacher: teacher.name, subject: subject.subject, type: 'lecture' }
                                        lecturesRemaining--
                                    }
                                }

                            })
                        })
                        // }
                    })
                })

            }
            // console.log(lecturesRemaining, 'stilll remaining for', teacher.name, subject.subject, course, semester);

            if (lecturesRemaining > 0) {
                timeSlots.forEach(slot => {
                    daysOfWeek.forEach(day => {
                        if (lecturesRemaining <= 0) {
                            return
                        }
                        let timetableEntry = initialTimetableObj[course][branch][semester][section][day][slot]
                        if (timetableEntry == 'vacant') {
                            timeSlots.forEach(slotInner => {
                                daysOfWeek.forEach(dayInner => {
                                    let timetableEntryInner = initialTimetableObj[course][branch][semester][section][dayInner][slotInner]
                                    if (lecturesRemaining <= 0 || !timetableEntryInner || teacherSchedule[dayInner][slotInner]) {
                                        return
                                    }

                                    if (timetableEntryInner.type == 'lab') {
                                        let newTname = initialTimetableObj[course][branch][semester][section][dayInner][slotInner].teacher
                                        if (teachersSchedules[newTname][day][slot]) {
                                            return
                                        }
                                        let newTelement = timetableEntryInner
                                        let alreadyClass = false
                                        let alreadyLab = false
                                        for (const slots in teacherSchedule[dayInner]) {
                                            let teacherScheduleInnerEntry = teacherSchedule[dayInner][slots]
                                            if (!teacherScheduleInnerEntry) {
                                                continue
                                            }
                                            if (teacherScheduleInnerEntry.course == course && teacherScheduleInnerEntry.branch == branch && teacherScheduleInnerEntry.semester == semester && teacherScheduleInnerEntry.section == section && teacherScheduleInnerEntry.subject == subject.subject && teacherScheduleInnerEntry.type == 'lecture') {
                                                alreadyClass = true
                                            }
                                        }
                                        for (const slots in teachersSchedules[newTname][day]) {
                                            let teacherScheduleInnerEntry = teachersSchedules[newTname][day][slots]
                                            if (!teacherScheduleInnerEntry) {
                                                continue
                                            }
                                            if (teacherScheduleInnerEntry.course == course && teacherScheduleInnerEntry.branch == branch && teacherScheduleInnerEntry.semester == semester && teacherScheduleInnerEntry.section == section && teacherScheduleInnerEntry.subject == newTelement.subject && teacherScheduleInnerEntry.type == 'lab') {
                                                alreadyLab = true
                                            }
                                        }
                                        if (!alreadyClass && !alreadyLab) {
                                            teachersSchedules[newTname][day][slot] = { course, branch, semester, section, subject: newTelement.subject, type: 'lab' }
                                            initialTimetableObj[course][branch][semester][section][day][slot] = { teacher: newTname, subject: newTelement.subject, type: 'lab' }
                                            teachersSchedules[newTname][dayInner][slotInner] = null
                                            teacherSchedule[dayInner][slotInner] = { course, branch, semester, section, subject: subject.subject, type: 'lecture' }
                                            initialTimetableObj[course][branch][semester][section][dayInner][slotInner] = { teacher: teacher.name, subject: subject.subject, type: 'lecture' }
                                            lecturesRemaining--
                                        }
                                    }
                                })
                            })
                        }
                    })
                })
            }
            if (lecturesRemaining > 0) {
                daysOfWeek.forEach(day => {
                    let classAssigned = false
                    let alreadyClass = false
                    for (const slots in teacherSchedule[day]) {
                        let teacherScheduleInnerEntry = teacherSchedule[day][slots]
                        if (!teacherScheduleInnerEntry) {
                            continue
                        }
                        if (teacherScheduleInnerEntry.course == course && teacherScheduleInnerEntry.branch == branch && teacherScheduleInnerEntry.semester == semester && teacherScheduleInnerEntry.section == section && teacherScheduleInnerEntry.subject == subject.subject && teacherScheduleInnerEntry.type == 'lecture') {
                            alreadyClass = true
                        }
                    }

                    if (lecturesRemaining <= 0 || alreadyClass) {
                        return
                    }

                    timeSlots.forEach(slot => {
                        let timetableEntry = initialTimetableObj[course][branch][semester][section][day][slot]
                        if (!classAssigned && !teacherSchedule[day][slot] && (!timetableEntry || timetableEntry == 'vacant')) {
                            teacherSchedule[day][slot] = { course, branch, semester, section, subject: subject.subject, type: 'lecture' };
                            initialTimetableObj[course][branch][semester][section][day][slot] = { teacher: teacher.name, subject: subject.subject, type: 'lecture' };
                            classAssigned = true
                            lecturesRemaining--;
                        }
                    });
                });
            }
            if (lecturesRemaining > 0) {
                console.log('couldnt lectures', lecturesRemaining, teacher.name);
            }
        })
    })
    if (maxClassesCheck.length > 0) {
        return { error: true, maxClassesCheck }
    }
    return { error: false, timetables: initialTimetableObj, teachersSchedules }

}


export function checkTeacherCheckbox(allTeachers, obj) {
    let outerCheckArr = allTeachers.filter(teacher => {
        let checkArr = teacher.teacherData.filter(subj => {
            return ((subj.checked == true) && (subj.branch == obj.branch) && (subj.semester == obj.semester) && (subj.section == obj.section) && (subj.course == obj.course) && (subj.subject == obj.subject) && (((Number(subj.lectures) > 0) && (Number(obj.lectures) > 0)) || ((Number(subj.labs) > 0) && (Number(obj.labs) > 0))))
        })
        return checkArr.length > 0
    })
    console.log(outerCheckArr.length, 'for lols');
    if (outerCheckArr.length > 0) {
        return outerCheckArr[0]
    } else {
        return false
    }
}


export function checkAllSubjectsAssigned(timetables, subjects) {
    let subjectCheckObj = {}
    Object.keys(timetables).map(course => {
        subjectCheckObj[course] = {}
        Object.keys(timetables[course]).map(branch => {
            subjectCheckObj[course][branch] = {}
            Object.keys(timetables[course][branch]).map(semester => {
                subjectCheckObj[course][branch][semester] = {}
                Object.keys(timetables[course][branch][semester]).map(section => {
                    subjectCheckObj[course][branch][semester][section] = []
                })
            })
        })
    })

    subjects.forEach(subj => {
        Object.keys(subjectCheckObj[subj.course][subj.branch][subj.semester]).forEach(section => {
            subjectCheckObj[subj.course][subj.branch][subj.semester][section] = [...subj.subjects]
        })
    })
    Object.keys(timetables).map(course => {
        Object.keys(timetables[course]).map(branch => {
            Object.keys(timetables[course][branch]).map(semester => {
                Object.keys(timetables[course][branch][semester]).map(section => {
                    Object.keys(timetables[course][branch][semester][section]).map(day => {
                        let values = Object.values(timetables[course][branch][semester][section][day])
                        values.forEach(value => {
                            if (value && value != 'vacant') {
                                subjectCheckObj[course][branch][semester][section] = subjectCheckObj[course][branch][semester][section].filter(subj => {
                                    return (subj.name != value.subject)
                                })
                            }
                        })
                    })
                })
            })
        })
    })


    let result = []
    Object.keys(timetables).map(course => {
        Object.keys(timetables[course]).map(branch => {
            Object.keys(timetables[course][branch]).map(semester => {
                Object.keys(timetables[course][branch][semester]).map(section => {
                    if (subjectCheckObj[course][branch][semester][section].length > 0) {
                        result.push({
                            course, branch, semester, section, subjects: subjectCheckObj[course][branch][semester][section]
                        })
                    }
                })
            })
        })
    })
    console.log(result, 'result from checkallsubs');
    return result
}

import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export function downloadPdf(pdfRef, name) {
    const input = pdfRef.current
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4', true)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width;
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        pdf.save(`${name}`)
    })
}







// export function checkConstraintsLab({ teacher, subject }, semesters, courses, timetables, { semester, day, slot }) {
//     const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30"];
//     let allowed = true

//     courses.forEach(course => {
//         semesters[course].forEach(sem => {
//             if (timetables[course][sem][day][slot] && (timetables[course][sem][day][slot].teacher == teacher)) {
//                 allowed = false
//             }
//         })
//     })

//     return allowed
// }


// export function checkConstraintsLecture({ teacher, subject }, semesters, courses, timetables, { currCourse, semester, day, slot }) {
//     const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30"];
//     let allowed = true

//     // check atomicity

//     courses.forEach(course => {
//         semesters[course].forEach(sem => {
//             if (timetables[course][sem][day][slot] && (timetables[course][sem][day][slot].teacher == teacher)) {
//                 allowed = false
//             }
//         })
//     })

//     // same subj lecture same day
//     timeSlots.forEach(timeSlot => {
//         if (timetables[currCourse][semester][day][timeSlot] && timetables[currCourse][semester][day][timeSlot].subject == subject && timetables[currCourse][semester][day][timeSlot].type == 'lecture') {
//             allowed = false
//         }
//     })

//     // first class of day issue
//     if (slot == "9:30-10:30") {
//         daysOfWeek.forEach(dayOfWeek => {
//             if (timetables[currCourse][semester][dayOfWeek]["9:30-10:30"] && timetables[currCourse][semester][dayOfWeek]["9:30-10:30"].teacher == teacher) {
//                 allowed = false
//             }
//         })
//     }

//     return allowed
// }

// export function generateTimetables(teachers) {
//     const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30"];
//     const courses = ["BTech", "MTech"];
//     const semesters = {
//         BTech: ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"],
//         MTech: ["first", "second", "third", "fourth"]
//     };
//     const reverseTimeSlots = [...timeSlots].reverse();
//     const reverseDaysOfWeek = [...daysOfWeek].reverse();


//     // teacher schedules

//     let teachersSchedules = {}

//     teachers.forEach(teacher => {
//         teachersSchedules[teacher.name] = {}
//         daysOfWeek.forEach(day => {
//             teachersSchedules[teacher.name][day] = {}
//             timeSlots.forEach(slot => {
//                 teachersSchedules[teacher.name][day][slot] = null;
//             });
//         });
//     })

//     // Initialize initial timetable object
//     const initialTimetableObj = {};
//     courses.forEach(course => {
//         initialTimetableObj[course] = {};
//         semesters[course].forEach(sem => {
//             initialTimetableObj[course][sem] = {};
//             daysOfWeek.forEach(day => {
//                 initialTimetableObj[course][sem][day] = {};
//                 timeSlots.forEach(slot => {
//                     initialTimetableObj[course][sem][day][slot] = null;
//                 });
//             });
//         });
//     });

//     // Initialize lecture and lab counts
//     const lectureCount = {};
//     const labCount = {};
//     courses.forEach(course => {
//         lectureCount[course] = {};
//         labCount[course] = {};
//         semesters[course].forEach(sem => {
//             lectureCount[course][sem] = 0;
//             labCount[course][sem] = 0;
//         });
//     });

//     // Calculate lecture and lab counts
//     teachers.forEach(teacher => {
//         teacher.teacherData.forEach(subject => {
//             lectureCount[subject.course][subject.semester] += Number(subject.lectures);
//             labCount[subject.course][subject.semester] += Number(subject.labs);
//         });
//     });

//     // Insert vacant lectures
//     courses.forEach(course => {
//         semesters[course].forEach(sem => {
//             let totalSlots = daysOfWeek.length * timeSlots.length;
//             let vacantSlots = totalSlots - (lectureCount[course][sem] + labCount[course][sem]);
//             if (vacantSlots > 0) {
//                 reverseTimeSlots.forEach(slot => {
//                     reverseDaysOfWeek.forEach(day => {
//                         if (vacantSlots > 0) {
//                             initialTimetableObj[course][sem][day][slot] = 'vacant';
//                             vacantSlots--;
//                         }
//                     });
//                 });
//             }
//         });
//     });


//     // Sort subjects and labs
//     const sortedSubjects = {};
//     courses.forEach(course => {
//         sortedSubjects[course] = {};
//         semesters[course].forEach(sem => {
//             sortedSubjects[course][sem] = {
//                 lectures: [],
//                 labs: []
//             };
//         });
//     });

//     teachers.forEach(teacher => {
//         teacher.teacherData.forEach(subject => {
//             for (let i = 0; i < Number(subject.lectures); i++) {
//                 sortedSubjects[subject.course][subject.semester].lectures.push({
//                     teacher: teacher.name,
//                     subject: subject.subject
//                 });
//             }
//             for (let i = 0; i < Number(subject.labs); i++) {
//                 sortedSubjects[subject.course][subject.semester].labs.push({
//                     teacher: teacher.name,
//                     subject: subject.subject
//                 });
//             }
//         });
//     });

//     console.log(sortedSubjects, initialTimetableObj, 'haw');
//     // main timetable generation

//     let notPossible = false
//     courses.forEach(course => {
//         semesters[course].forEach(semester => {
//             let whileFlag = true
//             let loopCount = 0

//             let startDeletingVacants = false

//             while (whileFlag) {
//                 whileFlag = false
//                 loopCount++


//                 // shuffling
//                 let shuffledTempLabs = shuffleArray(sortedSubjects[course][semester].labs)
//                 let shuffledTempLectures = shuffleArray(sortedSubjects[course][semester].lectures)
//                 sortedSubjects[course][semester] = {
//                     lectures: shuffledTempLectures,
//                     labs: shuffledTempLabs
//                 }


//                 // for labs
//                 reverseTimeSlots.forEach(slot => {
//                     daysOfWeek.forEach(day => {
//                         if (initialTimetableObj[course][semester][day][slot] == null) {
//                             let count = 0
//                             let length = sortedSubjects[course][semester].labs.length
//                             for (let i = 0; i < sortedSubjects[course][semester].labs.length; i++) {
//                                 count++
//                                 let element = sortedSubjects[course][semester].labs[i];
//                                 let flag = checkConstraintsLab(element, semesters, courses, initialTimetableObj, { semester, day, slot })
//                                 if (flag) {
//                                     initialTimetableObj[course][semester][day][slot] = {
//                                         ...element, type: 'lab'
//                                     }
//                                     sortedSubjects[course][semester].labs.splice(i, 1)
//                                     teachersSchedules[element.teacher][day][slot] = {
//                                         course, semester, subject: element.subject, type: 'lab'
//                                     }
//                                     break;
//                                 }
//                                 if (count == length && !flag && startDeletingVacants) {
//                                     console.log('rannnnn');
//                                     outerLoop: for (let i = 0; i < timeSlots.length; i++) {
//                                         for (let j = 0; j < daysOfWeek.length; j++) {
//                                             const timeSlot = reverseTimeSlots[i];
//                                             const dayOfWeek = daysOfWeek[j];
//                                             if (initialTimetableObj[course][semester][dayOfWeek][timeSlot] == 'vacant') {
//                                                 console.log('rannn2222', course, semester, dayOfWeek, timeSlot, day, slot);
//                                                 initialTimetableObj[course][semester][dayOfWeek][timeSlot] = null;
//                                                 initialTimetableObj[course][semester][day][slot] = 'conflict'
//                                                 break outerLoop;
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     })
//                 })


//                 // for lectures

//                 timeSlots.forEach(slot => {
//                     daysOfWeek.forEach(day => {
//                         if (initialTimetableObj[course][semester][day][slot] == null) {
//                             let count = 0
//                             let length = sortedSubjects[course][semester].lectures.length
//                             for (let i = 0; i < sortedSubjects[course][semester].lectures.length; i++) {
//                                 count++
//                                 let element = sortedSubjects[course][semester].lectures[i];
//                                 let flag = checkConstraintsLecture(element, semesters, courses, initialTimetableObj, { currCourse: course, semester, day, slot })
//                                 if (flag) {
//                                     initialTimetableObj[course][semester][day][slot] = {
//                                         ...element, type: 'lecture'
//                                     }
//                                     sortedSubjects[course][semester].lectures.splice(i, 1)
//                                     teachersSchedules[element.teacher][day][slot] = {
//                                         course, semester, subject: element.subject, type: 'lecture'
//                                     }
//                                     break;
//                                 }
//                                 if (count == length && !flag && startDeletingVacants) {
//                                     console.log('rannnnn');
//                                     outerLoop: for (let i = 0; i < timeSlots.length; i++) {
//                                         for (let j = 0; j < daysOfWeek.length; j++) {
//                                             const timeSlot = timeSlots[i];
//                                             const dayOfWeek = daysOfWeek[j];
//                                             if (initialTimetableObj[course][semester][dayOfWeek][timeSlot] == 'vacant') {
//                                                 console.log('rannn2222', course, semester, dayOfWeek, timeSlot, day, slot);
//                                                 initialTimetableObj[course][semester][dayOfWeek][timeSlot] = null;
//                                                 initialTimetableObj[course][semester][day][slot] = 'conflict'
//                                                 break outerLoop;
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     })
//                 })

//                 let flagCheckArr = (sortedSubjects[course][semester].lectures.length > 0 || sortedSubjects[course][semester].labs.length > 0)
//                 console.log(sortedSubjects, 'hmmmm');
//                 if (flagCheckArr > 0) {
//                     console.log('ran again');
//                     whileFlag = true
//                 }

//                 console.log(loopCount, 'bruh');

//                 if (loopCount > 15) {
//                     startDeletingVacants = true
//                 }
//                 if (loopCount > 30) {
//                     notPossible = true
//                     break;
//                 }

//             }
//         })

//     })


//     if (notPossible) {
//         return false
//     }

//     return { timetables: initialTimetableObj, teachersSchedules }
// }




// export function generateTimetable(data, semester, generatedTimetables) {
//     let notPossible = false

//     let teachersData = JSON.parse(JSON.stringify(data));
//     // const semesters = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
//     const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30"];

//     // const timetables = {};

//     // semesters.forEach(semester => {
//     const timetable = {};

//     daysOfWeek.forEach(day => {
//         timetable[day] = {};
//         timeSlots.forEach(slot => {
//             timetable[day][slot] = {};
//         });
//     });


//     let subjsArray = Object.keys(teachersData[semester])

//     let finalSubjArr = []

//     let allKeysUsed = false;
//     while (!allKeysUsed) {
//         allKeysUsed = true;
//         subjsArray.forEach(sub => {
//             if (Number(teachersData[semester][sub].lectures) > 0) {
//                 finalSubjArr.push(sub);
//                 teachersData[semester][sub].lectures = Number(teachersData[semester][sub].lectures) - 1;
//                 allKeysUsed = false; // At least one key is not yet used
//             }
//         });
//     }



//     let whileLoopFlag = true
//     let loopCount = 0
//     while (whileLoopFlag) {
//         whileLoopFlag = false

//         let checkFailedArr = []

//         let finalSubjArrTemp = [...finalSubjArr]

//         if (loopCount > 0) {
//             finalSubjArrTemp = shuffleArray(finalSubjArr)
//         }

//         if (finalSubjArrTemp.length < 24) {
//             let numOfNullReq = 24 - finalSubjArrTemp.length
//             let spacing = Math.floor(finalSubjArrTemp.length / numOfNullReq)
//             let index = 0
//             for (let i = 0; i < numOfNullReq; i++) {
//                 index += (spacing + 1)
//                 finalSubjArrTemp.splice(index, 0, null)
//             }
//             console.log(finalSubjArrTemp, 'final subj arrrr', spacing);
//         }



//         daysOfWeek.forEach(day => {
//             timeSlots.forEach(slot => {
//                 if (finalSubjArrTemp.length > 0) {
//                     let currSubj = finalSubjArrTemp.shift()
//                     if (currSubj) {
//                         let check = timetableConstraints(generatedTimetables, { semester, day, slot }, teachersData[semester][currSubj].teacher, timetable)
//                         if (check.length > 0) {
//                             checkFailedArr.push({
//                                 subject: currSubj,
//                                 teacher: teachersData[semester][currSubj].teacher
//                             })
//                             timetable[day][slot] = null
//                         } else {
//                             timetable[day][slot] = {
//                                 subject: currSubj,
//                                 teacher: teachersData[semester][currSubj].teacher
//                             };
//                         }
//                     } else {
//                         timetable[day][slot] = null
//                     }
//                 }
//             });
//         })




//         daysOfWeek.forEach(day => {
//             timeSlots.forEach(slot => {
//                 let allowedTeachers = []
//                 if (timetable[day][slot] == null) {
//                     if (checkFailedArr.length > 0) {
//                         for (let i = 0; i < checkFailedArr.length; i++) {
//                             let flagArr = timetableConstraints(generatedTimetables, { semester, day, slot }, checkFailedArr[i].teacher, timetable)
//                             if (!(flagArr.length > 0)) {
//                                 allowedTeachers.push(checkFailedArr[i])
//                                 checkFailedArr.splice(i, 1);
//                                 break;
//                             }
//                         }
//                     }
//                 }
//                 if (allowedTeachers.length > 0) {
//                     timetable[day][slot] = {
//                         subject: allowedTeachers[0].subject,
//                         teacher: allowedTeachers[0].teacher
//                     }
//                 }
//             })
//         })

//         if (checkFailedArr.length > 0) {
//             console.log('loop ran again');
//             whileLoopFlag = true
//             loopCount++
//         }

//         if (loopCount > 35) {
//             notPossible = true
//             break
//         }
//     }
//     if (notPossible) {
//         return 'not possible'
//     } else {
//         return timetable
//     }
// }


// function timetableConstraints(data, posn, teacher, currData) {
//     const { semester, day, slot } = posn


//     const semesters = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
//     const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30"];


//     const checkArr = semesters.filter(s => {
//         if (data[s] && data[s][day][slot]) {
//             return data[s][day][slot].teacher == teacher && s != semester
//         } else {
//             return false
//         }
//     })


//     const checkArr2 = timeSlots.filter(s => {
//         return (currData[day][s]) && (currData[day][s].teacher == teacher)
//     })

//     if (checkArr.length > 0) {
//         console.log('teacher is getting assigned 2 classes at same time');
//     }
//     return [...checkArr, ...checkArr2]
// }


// function shuffleArray(array) {
//     let shuffledArray = array.slice();

//     for (let i = shuffledArray.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//     }

//     return shuffledArray;
// }


// export function constraintsCheckData(newData, oldData, semester) {
//     if (!newData.subject || !newData.teacher || !Number(newData.lectures)) {
//         return { allowed: false, reason: 'all fields need to have value' }
//     }
//     if (oldData[semester]) {
//         let allSubj = Object.keys(oldData[semester])
//         if (allSubj.includes(newData.subject)) {
//             return { allowed: false, reason: `subject is already being taught by ${oldData[semester][newData.subject].teacher}` }
//         }
//         let teacherCheckArr = allSubj.filter(s => {
//             return oldData[semester][s].teacher == newData.teacher
//         })
//         if (teacherCheckArr.length > 0) {
//             return { allowed: false, reason: `teacher is already teaching ${teacherCheckArr[0]} in this semester` }
//         }
//     }
//     return { allowed: true }
// }
