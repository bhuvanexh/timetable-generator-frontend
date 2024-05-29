import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, Paper } from '@mui/material';

import WarningIcon from '@mui/icons-material/Warning';
import SchoolIcon from '@mui/icons-material/School';
const ExceededClassesBox = ({ exceededBatches }) => {
    return (
        <Box sx={{ marginBlock: 4 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="error" /> Exceeded Classes: These batches have classes exceeding the possible weekly limit.
                </Typography>
                <List>
                    {exceededBatches.map((batch, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemIcon>
                                <SchoolIcon />
                            </ListItemIcon>
                            <Typography variant="body1">
                                {`${batch.course} - ${batch.branch}, Semester ${batch.semester}, Section ${batch.section}`}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default ExceededClassesBox