import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Paper } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import SubjectIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
const UnassignedSubjectsInfoBox = ({ checkArr }) => {
    return (
        <Box sx={{ marginBlock: 4 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="error" /> Unassigned Subjects: No teacher has filled in the data for these subjects yet.
                </Typography>
                <List>
                    {checkArr.map((item, index) => (
                        <ListItem key={index} alignItems="flex-start" sx={{ paddingBlock: 2 }}>
                            <ListItemIcon sx={{ margin: 0 }}>
                                <SchoolIcon />
                            </ListItemIcon>
                            <Box>
                                <Typography variant="body1">
                                    {`${item.course} - ${item.branch}, Semester ${item.semester}, Section ${item.section}`}
                                </Typography>
                                {item.subjects.map((subject, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SubjectIcon color="action" />
                                        <Typography variant="body2" color="textSecondary">
                                            {subject.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default UnassignedSubjectsInfoBox;
