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
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import InboxIcon from '@material-ui/icons/Inbox'

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


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function AppBarWithDrawer() {

    const [opendialog, setOpen] = React.useState(false);

    // Handle the open of the about dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Handle the close of the about dialog
    const handleClose = () => {
        setOpen(false);
    };
    const classes = useStyles();

    const [profileAnchor, setProfileAnchor] = React.useState(null);
    const open = Boolean(profileAnchor);

    // Handle the open of the user profile menu
    const handleProfileOpen = (event) => {
        setProfileAnchor(event.currentTarget);
    };

    // Handle the close of the user profile menu
    const handleProfileClose = () => {
        setProfileAnchor(null);
    };

    const [openDrawer, setOpenDrawer] = React.useState(false); // Side drawer state

    // Handle the open of side drawer
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    // Handle the close of the side drawer
    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    // Function handle logout click
    const handleLogout = (event) => {
        localStorage.clear();
    };

    // Variable containing Side drawer list items
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
                <ListItem button key={'Dashboard'} component={Link} to="/Dashboard">
                    <ListItemIcon><DashboardRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Dashboard</Typography></ListItemText>
                </ListItem>
                <ListItem button key={'Network Discovery'} component={Link} to="/Network Discovery">
                    <ListItemIcon><BlurOnRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Network Discovery</Typography></ListItemText>
                </ListItem>
                <ListItem button key={'Create Users'} component={Link} to="/admins">
                    <ListItemIcon><SupervisorAccountRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Manage Adminstrators</Typography></ListItemText>
                </ListItem>
                <ListItem button key={'Settings'} component={Link} to="/settings">
                    <ListItemIcon><BuildRoundedIcon /></ListItemIcon>
                    <ListItemText><Typography>Blocklist Settings</Typography></ListItemText>
                </ListItem>
                <ListItem button key={'About'} onClick={(event) => handleClickOpen()} >
                    <ListItemIcon><InboxIcon /></ListItemIcon>
                    <ListItemText><Typography>About</Typography></ListItemText>
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
                        <Typography variant="h5" style={{ marginLeft: "10px", paddingTop: "20px", fontFamily: "DalekPinpoint" }}>Brother Eye</Typography>
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
                                        <Typography variant='h5' style={{ fontFamily: "DalekPinpoint", color: '#079b' }} >
                                            Account Details
                                        </Typography>
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

            <Dialog onClose={handleClose} aria-labelledby="About" open={opendialog}>
                <DialogTitle  id="customized-dialog-title" onClose={handleClose}>
                <Box className={classes.title} style={{ paddingRight: "30px"}}>
                    <ListItemIcon><Avatar className={classes.avatarDrawer} src="Icons/final_logo.png" /></ListItemIcon>
                    </Box>
                    <Box className={classes.title}>
                    <Typography variant='h4' style={{ fontFamily: "DalekPinpoint" }} >
                        Brother Eye
                    </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Typography style={{ color: '#000' }} gutterBottom>
                        {'"Can you hear me, father '}
                        <Link href="https://dc.fandom.com/wiki/Bruce_Wayne_(New*Earth)" style={{ fontFamily: "DalekPinpoint", color: '#079b' }}>
                            Bruce
                        </Link>
                        {'? Eye am no longer a child. Eye have surpassed you, father. Eye have become a world unto myself."'}
                    </Typography>
                    <Typography style={{ color: '#079b' }} gutterBottom>
                        {'-- BrotherEye (When it tries to rule Earth)'}
                    </Typography>
                    <Divider />
                    <Typography style={{ color: '#000' }} gutterBottom>{'\n'}</Typography>

                    <Typography style={{ color: '#000' }} gutterBottom>{'\n'}</Typography>

                    <Typography style={{ color: '#000' }} gutterBottom>

                        {'For now BrotherEye is a network monitoring solution tasked to keep tabs on users in the current network.'}
                    </Typography>
                    <Typography style={{ color: '#000' }} gutterBottom>
                        {'It is SNMP based meaning it uses snmp to try to guess as much about the network topology as possible without going to LLDP or CDP as they are not as much supported in our current test enviroment.'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} style={{ fontFamily: "DalekPinpoint", color: '#fff', backgroundColor: '#079b' }}>
                        <Typography style={{ fontFamily: "DalekPinpoint" }}>
                            Okay
                        </Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}