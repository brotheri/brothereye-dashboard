import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import SupervisorAccountRoundedIcon from '@material-ui/icons/SupervisorAccountRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import DoneAllRoundedIcon from '@material-ui/icons/DoneAllRounded';
import HowToRegRoundedIcon from '@material-ui/icons/HowToRegRounded';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: "flex",
        flexGrow: 1,
        justifyContent: "center"
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    avatar: {
        margin: theme.spacing(1),
        width: theme.spacing(7),
        height: theme.spacing(7),
        // backgroundColor: theme.palette.secondary.main,
    },
    avatarDrawer: {
        marginLeft: theme.spacing(6),
        width: theme.spacing(15),
        height: theme.spacing(15),
        // backgroundColor: theme.palette.secondary.main,
    },
}));

export default function AppBarWithDrawer() {
    const classes = useStyles();

    const [profileAnchor, setProfileAnchor] = React.useState(null);
    const open = Boolean(profileAnchor);

    const handleProfileOpen = (event) => {
        setProfileAnchor(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchor(null);
    };

    const handleSettingsClose = () => {
        setProfileAnchor(null);
    };

    const [openDrawer, setOpenDrawer] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    const handleLogout = (event) => {
        localStorage.clear();
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={handleDrawerOpen}
            onKeyDown={handleDrawerClose}
        >
            <List>
                <ListItem button key={'Network Discovery'} component={Link} to="/Network Discovery">
                    <ListItemIcon><BlurOnRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Network Discovery</Typography></ListItemText>
                </ListItem>
                <ListItem button key={'Dashboard'} component={Link} to="/Dashboard">
                    <ListItemIcon><DashboardRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Dashboard</Typography></ListItemText>
                </ListItem>
                <ListItem button key={'Create Users'} component={Link} to="/admins">
                    <ListItemIcon><SupervisorAccountRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Manage Adminstrators</Typography></ListItemText>
                </ListItem>
                <ListItem button key={'Settings'} component={Link} to="/settings">
                    <ListItemIcon><BuildRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Blocklist Settings</Typography></ListItemText>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button key={'Logout'} onClick={(event) => handleLogout(event)} component={Link} to="/">
                    <ListItemIcon><ExitToAppRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Logout</Typography></ListItemText>
                </ListItem>
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <AppBar position="absolute" style={{ background: "#616771" }}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Box className={classes.title}>
                        <Avatar className={classes.avatar} src="Icons/final_logo.png" />
                        <Typography variant="h5" style={{ marginLeft: "10px", paddingTop: "20px" }}>Brother Eye</Typography>
                    </Box>

                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={profileAnchor}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleProfileClose}
                        >
                            <MenuItem>
                                <List>
                                    <ListItem style={{ display: "flex" }}>
                                        <ListItemIcon><Avatar className={classes.avatarDrawer} src="Icons/final_logo.png" /></ListItemIcon>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><AccountCircleRoundedIcon /></ListItemIcon>
                                        <ListItemText><Typography>{localStorage.getItem('full_name')}</Typography></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><EmailRoundedIcon /></ListItemIcon>
                                        <ListItemText><Typography>{localStorage.getItem('email')}</Typography></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><HowToRegRoundedIcon /></ListItemIcon>
                                        <ListItemText><Typography>{localStorage.getItem('role')}</Typography></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><DoneAllRoundedIcon /></ListItemIcon>
                                        <ListItemText><Typography>{localStorage.getItem('lastLoginAttempt')}</Typography></ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><EventRoundedIcon /></ListItemIcon>
                                        <ListItemText><Typography>{localStorage.getItem('createdAt')}</Typography></ListItemText>
                                    </ListItem>
                                </List>
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={openDrawer} onClose={handleDrawerClose}>
                {list("left")}
            </Drawer>
        </div>
    );

}