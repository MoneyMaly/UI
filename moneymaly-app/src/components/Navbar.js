import React from 'react';
import { Link } from 'react-router-dom';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import AssessmentIcon from '@material-ui/icons/Assessment';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import OffersNotifications from './OffersNotifications';
import logoo from '../images/final-logo.png';
import jwt_decode from "jwt-decode";


const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(6),
        right: theme.spacing(2)
    },
    scrollUpFab: {
        color: "#fff",
        backgroundColor: '#209CEE',
        '&:hover': {
            backgroundColor: '#67bcf3',
            color: '#fff'
        },
    },
    appBar: {
        background: '#209CEE',
        position: 'static'
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        marginRight: theme.spacing(1),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    }
}));

const drawerWidth = 240;

const useStylesNew = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        background: '#209CEE',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        background: '#F0F8FF',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
};

export default function PrimarySearchAppBar(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    // New App Bar
    const classesNew = useStylesNew();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleMenu(event) {
        setAnchorEl(event.currentTarget);
    }
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            ></Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
            {(localStorage.getItem('UserRole') === "private") ? (<OffersNotifications />) : ("")}
                <p>Offers</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem component={Link} to={'/UserProfile'}>
                <IconButton color="inherit">
                    <AccountCircle />
                </IconButton>
                <p>My Profile</p>
            </MenuItem>
            <MenuItem component={Link} to={'/Logout'}>
                <IconButton color="inherit">
                    <ExitToAppIcon />
                </IconButton>
                Logout
            </MenuItem>
        </Menu>
    );

    const IsUserTokenValid = () => {
        try {
            var tokenExp = jwt_decode(localStorage.getItem('token')).exp;
            if (tokenExp < Date.now() / 1000) {
                return false;
            }
            return true;
        } catch (InvalidTokenError) {
            console.warn('Invalid User Token')
            return false;
        }
    };
    return (
        <div className={classes.grow}>
            <AppBar position="static" className={clsx(classesNew.appBar, { [classesNew.appBarShift]: open, })}  >
                <Toolbar id="back-to-top-anchor">
                <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classesNew.menuButton, open && classesNew.hide)}
                    >
                        <MenuIcon />
                    </IconButton>                    
                    <img src={logoo} width={'9%'}></img>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                    {(localStorage.getItem('UserRole') === "private") ? (<OffersNotifications />) : ("")}
                        <Tooltip title="Notifications" arrow>
                            <IconButton aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="My Profile" arrow>
                            <IconButton color="inherit">
                            <Link to="/UserProfile" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                    <AccountCircle />
                                </Link>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout" arrow>
                            <IconButton color="inherit">
                            <Link to="/Logout" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                    <ExitToAppIcon />
                                </Link>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classesNew.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classesNew.drawerPaper,
                }}
            >
                <div className={classesNew.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button component={Link} to={'/'} onClick={handleDrawerClose}>
                        <IconButton color="inherit"><HomeIcon /></IconButton>
                        Home
                    </ListItem>
                    <ListItem button component={Link} to={'/UserDashboard'} onClick={handleDrawerClose}>
                        <IconButton color="inherit"><AssessmentIcon /></IconButton>
                        Dashboard
                    </ListItem>
                    <ListItem button component={Link} to={'/UserProfile'} onClick={handleDrawerClose}>
                        <IconButton color="inherit"><AccountCircle /></IconButton>
                        My Profile
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button component={Link} to={'/'} onClick={handleDrawerClose}>
                        <IconButton color="inherit"><InfoIcon /></IconButton>
                        About
                    </ListItem>
                    <ListItem button component={Link} to={'/'} onClick={handleDrawerClose}>
                        <IconButton color="inherit"><MailIcon /></IconButton>
                        Contact Us
                    </ListItem>
                </List>
                <Divider />
                <List>
                {
                        (!IsUserTokenValid()) ?
                            (
                                <ListItem button component={Link} to={'/Login'} onClick={handleDrawerClose}>
                                    <IconButton color="inherit"><ExitToAppIcon /></IconButton>
                        Login
                        </ListItem>
                            ) : (
                                <ListItem button component={Link} to={'/Logout'} onClick={handleDrawerClose}>
                                    <IconButton color="inherit"><ExitToAppIcon /></IconButton>
                        Logout
                        </ListItem>
                            )
                    }
                </List>
                <Divider />
            </Drawer>
            <ScrollTop {...props}>
                <Fab className={classes.scrollUpFab} size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
};
    