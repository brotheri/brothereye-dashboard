import React, { useState, useEffect } from "react";
import Graph from "react-graph-vis";
import axios from "axios";
import Copyright from "../components/copyrights";
import AppBarWithDrawer from "../components/Vis page/material.appbar.drawer";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';

import MaterialTable from 'material-table';

const AntSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.primary.main,
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.secondary,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: "xl",
        // margin: "auto",
        // display: "flex",
        marginTop: "15px",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    graph: {
        width: "80vw",
        height: "80vh",
        backgroundColor: "#424242",
    },
    gridContainer: {
        marginTop: "100px"
    },
    title: {
        fontSize: 14,
    }, cardContainer: {
        flexGrow: "1",
        backgroundColor: "#4F4F4F"
    }
}));

export default function Vis() {
    const classes = useStyles();

    const [data, setData] = useState({
        nodes: [],
        edges: [],
    });
    const [loading, setLoading] = useState(true);
    const [VLAN, setVLAN] = React.useState("VLAN description");

    const [open, setOpen] = React.useState(false);

    const anchorRef = React.useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const [tableContent, setTableContent] = React.useState({
        columns: [
            { title: 'IP Address', field: 'ip' },
            { title: 'MAC Address', field: 'mac' },
            { title: 'Name', field: 'name' },
            { title: 'Vendor', field: 'vendor' },
            { title: 'Device Type', field: 'type' },
            { title: 'SNMP Community', field: 'snmpcommunity' },
            { title: 'SNMP Enabeled', field: 'snmpenabled' },
        ],
        data: [],
    });
    const [tableTitle,setTableTitle] = React.useState("");
    const [switchMonitor, setSwitchMonitor] = React.useState({
        checkedA: true
    });

    let pc = "Icons/computer.png";
    let server = "Icons/server.png";
    let router = "Icons/router (1).png";

    const handleChange = (event) => {
        setSwitchMonitor({ ...switchMonitor, [event.target.name]: event.target.checked });
        setLoading(true);
    };

    const pollfn = () => {
        // Your code here
        if (!switchMonitor.checkedA) {
            axios.get(`http://193.227.38.177:3000/api/v1/discover/Vlans`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                const data = res.data;
                if (data.value) {
                    setTimeout(pollfn, 5 * 1000);
                    return;
                }
                setTableContent({
                    columns: [
                        { title: 'Name', field: 'name' }
                    ],
                    data: res.data.vlans,
                })
                console.log(data);
                setLoading(false);
                setTableTitle("VLANs");
            });
        }
        else {
            axios.get(`http://193.227.38.177:3000/api/v1/discover/devices`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                const data = res.data;
                if (data.value) {
                    setTimeout(pollfn, 5 * 1000);
                    return;
                }
                setTableContent({
                    columns: [
                        { title: 'IP Address', field: 'ip' },
                        { title: 'MAC Address', field: 'mac' },
                        { title: 'Name', field: 'name' },
                        { title: 'Vendor', field: 'vendor' },
                        { title: 'Device Type', field: 'type' },
                        { title: 'SNMP Community', field: 'snmpCommunity' },
                        { title: 'SNMP Enabled', field: 'snmpEnabled' },
                    ],
                    data: res.data.nodes,
                })
                setLoading(false);
                setTableTitle("Devices");
            });
        }
    }

    useEffect(pollfn, [switchMonitor.checkedA]);

    const handleClickAwayClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    }

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
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const options = {
        autoResize: true,
        interaction: {
            hover: true,
        },
        edges: {
            arrows: {
                to: { enabled: false, scaleFactor: 1 },
                middle: { enabled: false, scaleFactor: 1 },
                from: { enabled: false, scaleFactor: 1 },
            },
            font: {
                color: "black",
                face: "Tahoma",
                size: 10,
                align: "top",
                strokeWidth: 0.3,
                strokeColor: "black",
            },
            shadow: true,
        },
        nodes: {
            borderWidth: 1,
            borderWidthSelected: 2,
            shape: "circle",
            color: {
                background: "#424242",
                border: "black",
            },
            font: {
                color: "white",
                size: 10,
                face: "Tahoma",
                background: "none",
                strokeWidth: 0,
                strokeColor: "#ffffff",
            },
            shadow: true,
        },
        groups: {
            PC: {
                shape: "circularImage",
                image: pc,
                cid: 0,
            },
            switch: {
                shape: "circularImage",
                image: router,
                cid: 1,
            },
            vlan: {
                shape: "circularImage",
                image: server,
                cid: 2,
            },
        },
        physics: true,
        layout: {
            randomSeed: undefined,
            improvedLayout: true,
            hierarchical: {
                enabled: false,
                levelSeparation: 120,
                nodeSpacing: 100,
                treeSpacing: 100,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: "UD", // UD, DU, LR, RL
                sortMethod: "directed", // hubsize, directed
            },
        },
    };

    const events = {
        select: function (event) {
            var { nodes, edges } = event;
        },
    };

    return (
        <Container className={classes.root}>
            <AppBarWithDrawer />
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    {loading ? (
                        <Backdrop open={loading}>
                            <CircularProgress color="secondary" />
                        </Backdrop>
                    ) : (
                            <Grid container spacing={2}>
                                {/* <Grid item xs={3}>
                                    <Card className={classes.cardContainer} variant="outlined">
                                        <CardContent>
                                            <Card variant="outlined" color="secondary" style={{ backgroundColor: "#424242", marginBottom: "15px", flexGrow: "1" }}>
                                                <CardContent>
                                                    <Typography className={classes.title} color="secondary" gutterBottom>{VLAN}</Typography>
                                                </CardContent>
                                            </Card>
                                            <div style={{ marginTop: "15px" }}>
                                                <Paper style={{ display: 'flex', backgroundColor: "#424242" }}>
                                                    <Button
                                                        ref={anchorRef}
                                                        variant="outlined"
                                                        color="secondary"
                                                        size="large"
                                                        aria-controls={open ? 'menu-list-grow' : undefined}
                                                        aria-haspopup="true"
                                                        onClick={handleToggle}
                                                        style={{ flexGrow: "1" }}
                                                    >select VLAN</Button>
                                                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                                        {({ TransitionProps, placement }) => (
                                                            <Grow
                                                                {...TransitionProps}
                                                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                                            >
                                                                <Paper style={{ maxHeight: 300, overflow: 'auto' }}>
                                                                    <ClickAwayListener onClickAway={handleClickAwayClose}>
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
                                </Grid> */}
                                <Grid item xs={3}>
                                    <Typography component="div">
                                        <Grid component="label" container alignItems="center" spacing={1}>
                                            <Grid item style={{ color: "red" }}>VLAN</Grid>
                                            <Grid item>
                                                <AntSwitch checked={switchMonitor.checkedA} onChange={handleChange} name="checkedA" />
                                            </Grid>
                                            <Grid item style={{ color: "red" }}>Devices</Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <MaterialTable
                                        title={tableTitle}
                                        columns={tableContent.columns}
                                        data={tableContent.data}
                                    />
                                    {/* <Graph
                                        style={{ height: "60vh", background: "#424242" }}
                                        graph={data}
                                        options={options}
                                        events={events}
                                        getNetwork={(network) => {
                                            //  if you want access to vis.js network api you can set the state in a parent component using this property
                                            network.on("hoverNode", function (properties) {
                                                console.log("hoverNode Event:", properties);
                                                console.log(network);
                                            });
                                            network.on("blurNode", function (properties) {
                                                console.log("blurNode Event:", properties);
                                            });
                                        }}
                                    /> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <Box mt={8}>
                                        <Copyright />
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                </Grid>
            </Grid>
        </Container>
    );
}
