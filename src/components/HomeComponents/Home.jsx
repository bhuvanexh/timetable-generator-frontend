import * as React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ReactTyped } from 'react-typed';
import { Box, Container, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    return (
        <Box component="div" sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 }
            , flexDirection: "column", alignItems: "center", textAlign: 'center', flexGrow: 1, paddingBlock: { xs: "30px 24px", sm: "45px 32px", md: "64px 48px" }
        }}>
            <Typography sx={{
                fontSize: { xs: "1.5rem", sm: "3rem", md: '3.5rem' }
            }}
                variant="h2" gutterBottom>
                Organizing College Timetables
            </Typography>
            <Typography component="p" sx={{
                fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem" },
                display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 'bold', color: '#333'
            }}>
                helping you &nbsp;
                <Typography component="span" sx={{
                    fontSize: { xs: "1.15rem", sm: "1.6rem", md: "2rem" },
                    fontWeight: 'bold', color: '#EF036C'
                }}>
                    <ReactTyped
                        strings={['view', 'download', 'manage', 'create']}
                        typeSpeed={120}
                        backSpeed={140}
                        loop
                    />
                </Typography>
                &nbsp; your timetables
            </Typography>
            <Typography component="p" sx={{
                fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem" }
                , color: '#555',
                mt: { xs: 4, sm: 5, md: 6 }
            }}>
                there is something in the box for everyone
            </Typography>
            <Typography component="p" sx={{
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                color: '#555'
            }}>
                so&nbsp;
                <Typography component="span" sx={{
                    fontSize: { xs: "1rem", sm: "1.35rem", md: "1.65rem" },
                    fontWeight: 'bold', color: 'black'
                }}>
                    GET STARTED
                </Typography>
                &nbsp;as
            </Typography>
            <Container sx={{
                display: "flex", justifyContent: "center", alignItems: "center",
                gap: { xs: 1, sm: 2, md: 3, lg: 4 },
                flexDirection: { xs: "column", sm: "row" },
                mt: 1
            }}>
                <Button onClick={() => navigate('/student')} variant="contained" color="primary" sx={{
                    width: { xs: "120px", sm: "150px", md: "200px" },
                    height: { xs: "35px", sm: "40px", md: "50px" },
                    fontSize: { md: "1.25rem" }
                }}>
                    Student
                </Button>
                or
                <Button onClick={() => navigate('/teacher')} variant="contained" color="primary" sx={{
                    width: { xs: "120px", sm: "150px", md: "200px" },
                    height: { xs: "35px", sm: "40px", md: "50px" },
                    fontSize: { md: "1.25rem" }
                }}>
                    Teacher
                </Button>
                or
                <Button onClick={() => navigate('/admin')} variant="contained" color="primary" sx={{
                    width: { xs: "120px", sm: "150px", md: "200px" },
                    height: { xs: "35px", sm: "40px", md: "50px" },
                    fontSize: { md: "1.25rem" }
                }}>
                    Admin
                </Button>
            </Container>
        </Box>
    );
}


export default Home;
