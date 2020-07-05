import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import VLANDropDownMenu from './material.VLANdropDownMenu'

const useStyles = makeStyles({
    root: {
        flexGrow: "1",
        backgroundColor: "#4F4F4F"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    dropDownpaper: {
        display: 'flex',
        backgroundColor: "#424242"
    }
});

export default function OutlinedCard({ Data }) {
    const classes = useStyles();
    const [VLAN, setVLAN] = React.useState("VLAN description");

    const [open, setOpen] = React.useState(false);

    const anchorRef = React.useRef(null);
    const data = Data;
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    // const handleClose=(event)=>{
    //     if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //         return;
    //     }
    //     setOpen(false);
    // }

    function handleClose(node) {
        return function (event) {
            console.log(node.devices.length);
            setVLAN("VLAN name : " + node.label + "\. Number of connected devices : " + node.devices.length);
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }
            setOpen(false);
        }
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Card variant="outlined" color="secondary" style={{ backgroundColor: "#424242", marginBottom: "15px", flexGrow: "1" }}>
                    <CardContent>
                        <Typography className={classes.title} color="secondary" gutterBottom>{VLAN}</Typography>
                    </CardContent>
                </Card>
                <div style={{ marginTop: "15px" }}>
                    <Paper className={classes.paper}>
                        <Button
                            ref={anchorRef}
                            variant="outlined"
                            color="secondary"
                            size="large"
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            style={{ flexGrow: "1" }}
                        >
                            select VLAN
                        </Button>
                        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper style={{ maxHeight: 300, overflow: 'auto' }}>
                                        <ClickAwayListener onClickAway={handleClose()}>
                                            <MenuList autoFocusItem={open} id="menu-list-grow" style={{ background: "#616771" }} onKeyDown={handleListKeyDown}>
                                                {data.nodes.map((node, i) => (
                                                    <MenuItem key={i} onClick={handleClose(node)}>{node.label}</MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Paper>
                </div>
            </CardContent>
        </Card>
    );
}
