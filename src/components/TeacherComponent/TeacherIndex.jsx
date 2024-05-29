import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdminTeacher from "../AdminComponents/AdminTeacherComponents/AdminTeacher"
import TeacherSchedule from './TeacherSchedule';
import TeacherPassword from './TeacherPassword';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: { xs: 0, sm: 1, md: 3 } }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TeacherIndex() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (

        <Box sx={{ width: '95%', marginInline: "auto" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Fill Data" {...a11yProps(0)} />
                    <Tab label="Check Schedule" {...a11yProps(1)} />
                    <Tab label="Reset Password" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AdminTeacher />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <TeacherSchedule />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <TeacherPassword />
            </CustomTabPanel>
        </Box>
    );
}


