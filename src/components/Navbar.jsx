import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from "../assets/fulllogo.jpg";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTeacher, getCurrTeacher, getTeachersError, getTeachersStatus, teacherLogOut } from '../features/teachersSlice';
import { useEffect } from 'react';
import { MdExitToApp } from 'react-icons/md';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import ErrorComponent from './ErrorComponent';
import Loading from './Loading';

const drawerWidth = 250;
const navItems = ['Home', 'About', 'Contact'];

function Navbar(props) {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { pathname } = useLocation()
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch()
    const teacher = getCurrTeacher()
    const teacherError = getTeachersError()

    console.log(teacherError, 'errorrrr', teacher);


    useEffect(() => {
        async function fetch() {
            await dispatch(fetchTeacher())
            setLoading(false)
        }
        fetch()
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    async function handleLogout() {
        const res = await dispatch(teacherLogOut())
        navigate('/')
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2, padding: "5px 4px 15px", borderBottom: '2px solid #d3dae5' }}>
                <Box sx={{ paddingInline: 1, borderRight: "2px solid #E5EAF2" }}>
                    <img src={logo} alt="logo" style={{ height: '60px' }} />
                </Box>
                <Typography variant="p" sx={{ fontSize: '1.15rem', color: "#0d47a1", fontWeight: "600" }}>
                    Bikaner Technical University
                </Typography>
            </Box>
            <List sx={{ paddingInline: "6px" }}>
                {navItems.map((item) => (
                    <ListItem sx={{ marginBottom: 1 }} key={item} disablePadding>
                        <ListItemButton disableGutters onClick={() => {
                            if (item == 'Home') {
                                navigate(`/`)
                            } else {
                                window.location.href = 'https://btu.ac.in/home/';
                            }
                        }} sx={{ paddingInline: 1, borderRadius: 2, bgcolor: (pathname == '/' && item == 'Home') && '#D6EAFF' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {teacher &&
                    <ListItem disablePadding>
                        <ListItemButton disableGutters onClick={handleLogout} sx={{
                            '&:hover': {
                                bgcolor: '#F3F6F9',
                            },
                            borderRadius: 2,
                            paddingInline: 1,
                            display: 'flex', gap: 1
                        }}>
                            <Typography>
                                Logout
                            </Typography>
                            <MdExitToApp size={25} />
                        </ListItemButton>
                    </ListItem>
                }
            </List>
        </Box >
    );

    const container = props.window !== undefined ? () => props.window().document.body : undefined;

    return (
        <>
            {!loading ?
                <>
                    <Box sx={{ display: 'flex' }}>
                        <CssBaseline />
                        <AppBar component="nav">
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 2, display: { md: 'none' } }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography
                                    color="inherit"
                                    sx={{ mr: 2, alignSelf: "center", marginLeft: "auto", fontSize: '2.5rem', color: "#82b1ff", fontWeight: "800", display: { md: 'none' } }}
                                >
                                    B.T.U
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={logo} alt="logo" style={{ height: '60px', marginRight: '10px' }} />
                                        <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                                            Bikaner Technical University
                                        </Typography>
                                    </Box>
                                </Typography>
                                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                    {navItems.map((item) => (
                                        <Button onClick={() => {
                                            if (item == 'Home') {
                                                navigate(`/`)
                                            } else {
                                                window.location.href = 'https://btu.ac.in/home/';
                                            }
                                        }} key={item} sx={{
                                            textAlign: 'center',
                                            '&:hover': {
                                                bgcolor: '#007bff',
                                            },
                                            color: (pathname == '/' && item == 'Home') ? '#90caf9' : "#fff",
                                            fontSize: (pathname == '/' && item == 'Home') ? '1.10rem' : "",
                                            marginRight: '2px'
                                        }}>
                                            {item}
                                        </Button>
                                    ))}
                                    {teacher && !teacher.msg &&
                                        <Button onClick={handleLogout} sx={{ color: '#fff', minWidth: "auto", marginLeft: 1 }}>
                                            <MdExitToApp size={25} />
                                        </Button>
                                    }
                                </Box>
                            </Toolbar>
                        </AppBar>
                        <nav>
                            <Drawer
                                container={container}
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                }}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                                }}
                            >
                                {drawer}
                            </Drawer>
                        </nav>
                    </Box>
                    <Outlet />
                </>
                :
                <Loading />
            }
            {teacherError && <ErrorComponent error={teacherError} />}
        </>
    );
}

Navbar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
    * You won't need it on your project.
    */
    window: PropTypes.func,
};

export default Navbar;
