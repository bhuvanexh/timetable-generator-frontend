import { Box, IconButton, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import AdminParametersCourses from './AdminParametersCourses';
import AdminParametersBranches from './AdminParametersBranches';
import { getAllParameters } from '../../../features/parametersSlice';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SuccessComponent from '../../SuccessComponent';


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


const AdminParametersIndex = () => {
    const [value, setValue] = React.useState(0);
    let parameters = getAllParameters()


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [successMsg, setSuccessMsg] = useState(null)


    return (
        <Box sx={{ width: '95%', marginInline: "auto" }}>
            <Link to=".." relative="path">
                <IconButton sx={{ mb: 2, display: "flex" }}>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Courses" {...a11yProps(0)} />
                    <Tab label="Branches" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AdminParametersCourses parameters={parameters} setSuccessMsg={setSuccessMsg} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <AdminParametersBranches parameters={parameters} setSuccessMsg={setSuccessMsg} />
            </CustomTabPanel>

            <SuccessComponent message={successMsg} />
        </Box>
    )
}

export default AdminParametersIndex