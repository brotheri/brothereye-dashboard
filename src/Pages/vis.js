import React, { useState, useEffect } from "react";
import Graph from "react-graph-vis";
import axios from "axios";
import Copyright from "../components/copyrights";
import AppBarWithDrawer from "../components/Vis page/material.appbar.drawer";

import DeviceMonitor from "../components/device.monitor"

import Chip from '@material-ui/core/Chip';
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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';

import { useHistory, Redirect } from 'react-router-dom';

import MaterialTable from 'material-table';
import { Tooltip } from "@material-ui/core";
import { render } from "fusioncharts";

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
    },
    cardContainer: {
        flexGrow: "1",
        display: "flex",
        backgroundColor: "#4F4F4F"
    }
}));

function CreateVisArray(vlanData) {
    let visData = [];
    let visLink = [];
    let uid = 1;

    const devices = vlanData.map((vlan, vi) => {
        return {
            label: "VLAN : " + vlan.name,
            id: uid++,
            group: "vlan",
            subnet: vlan.subnets.map((sub, si) => {
                let thisubId = uid++;
                return {
                    label: "Subnet : " + sub.ip + "\nMask: " + sub.mask,
                    id: thisubId,
                    cid: thisubId,
                    group: "switch",
                    devices: sub.devices.map((val, di) => {
                        return {
                            label: "Device : " + val.ip,
                            id: uid++,
                            group: "PC",
                            cid: thisubId
                        }
                    })
                }
            })
        }
    })

    return devices;

}

export default function Vis() {
    const classes = useStyles();
    const history = useHistory();

    const [appTheme, setAppTheme] = useState(localStorage.getItem("appTheme"));

    const [visGraphData, setVisGraphData] = useState({
        nodes: [],
        edges: [],
    });
    const [hierarchicalVisData, setHierarchicalVisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [VLAN, setVLAN] = React.useState("VLAN description");

    const [open, setOpen] = React.useState(false);

    const anchorRef = React.useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const [tableContent, setTableContent] = React.useState({});
    const [tableTitle, setTableTitle] = React.useState("");
    const [switchMonitor, setSwitchMonitor] = React.useState({
        devices: false
    });
    const [itr, setItr] = useState(2);

    let pc = "Icons/computer.png";
    let server = "Icons/server.png";
    let router = "Icons/router (1).png";

    const handleChange = (event) => {
        setSwitchMonitor({ ...switchMonitor, [event.target.name]: event.target.checked });
        setLoading(true);
    };

    const pollfn = () => {
        // Your code here
        if (!switchMonitor.devices) {
            axios.get(`http://193.227.38.177:3000/api/v1/discover/vlans`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                const data = res.data;
                if (data.value) {
                    setTimeout(pollfn, 20 * 1000);
                    return;
                }
                setTableContent({
                    columns: [
                        { title: 'Name', field: 'name' }
                    ],
                    data: res.data.vlans,
                })
                setHierarchicalVisData(CreateVisArray(res.data.vlans));
                setLoading(false);
                setTableTitle("VLANs");
            });
            // setTableContent({
            //     columns: [
            //         { title: 'Name', field: 'name' },
            //     ],
            //     data: vlanData,
            // })
            // setHierarchicalVisData(CreateVisArray(vlanData));
            // console.log(visGraphData);
            // setLoading(false);
            // setTableTitle("VLANs");
        }
        else {
            axios.get(`http://193.227.38.177:3000/api/v1/discover/devices`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                const data = res.data;
                if (data.value) {
                    setTimeout(pollfn, 20 * 1000);
                    return;
                }
                console.log(res.data.nodes);
                let nodes = res.data.nodes.map((node) => {
                    return {
                        ...node,
                        snmpCommunity: node.snmpEnabled ? node.snmpCommunity : "N/A"
                    }
                });
                setTableContent({
                    columns: [
                        { title: 'IP Address', field: 'ip' },
                        { title: 'MAC Address', field: 'mac' },
                        { title: 'Name', field: 'name' },
                        { title: 'Vendor', field: 'vendor' },
                        { title: 'Device Type', field: 'type' },
                        { title: 'SNMP Community', field: 'snmpCommunity' },
                        { title: 'SNMP Enabled', field: 'snmpEnabled' },
                        { title: 'Monitor', field: 'monitored' },
                    ],
                    data: nodes,
                })
                setLoading(false);
                setTableTitle("Devices");
            });
        }
    }

    useEffect(pollfn, [switchMonitor.devices]);

    const monitorDevice = (selectedRow) => {
        console.log(selectedRow._id);
        if (selectedRow.monitored) {
            localStorage.setItem("deviceID", selectedRow._id);
            history.push('/Device Monitor');
        }
    }

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
            },
            switch: {
                shape: "circularImage",
                image: router,
            },
            vlan: {
                shape: "circularImage",
                image: server,
            },
        },
        physics: true,
        layout: {
            randomSeed: undefined,
            improvedLayout: false,
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

    const handleChipClick = function () {
        let visData = [];
        let visLink = [];
        let vlanData = this;
        visData.push({ ...vlanData, subnet: undefined });
        vlanData.subnet.forEach(subnet => {
            visLink.push({ from: vlanData.id, to: subnet.id })
            visData.push({ ...subnet, devices: undefined })
            subnet.devices.forEach(device => {
                visLink.push({ from: subnet.id, to: device.id })
                visData.push(device)
            })
        })

        console.log(visData, visLink);
        setVisGraphData({
            nodes: visData,
            edges: visLink
        })
    };

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    const [selectedRow, setSelectedRow] = useState(null);

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

                                <Grid item xs={3}>
                                    <Typography component="div">
                                        <Grid component="label" container alignItems="center" spacing={1}>
                                            <Grid item style={{ color: "#61FFF2" }}>VLAN</Grid>
                                            <Grid item>
                                                <AntSwitch checked={switchMonitor.devices} onChange={handleChange} name="devices" />
                                            </Grid>
                                            <Grid item style={{ color: "#61FFF2" }}>Devices</Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <Card className={classes.cardContainer} variant="outlined">
                                        <CardContent>
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
                                                        style={{ flexGrow: "1",display:"flex" }}
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
                                                                            {hierarchicalVisData.map((vlan,i) => (
                                                                                <MenuItem key={i} onClick={handleClose(vlan)}>{vlan.label}</MenuItem>
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
                                <Grid item xs={12}>
                                    {switchMonitor.devices ? (
                                        <MaterialTable
                                            title={tableTitle}
                                            columns={tableContent.columns}
                                            data={tableContent.data}
                                            onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
                                            options={{
                                                
                                                sorting: true,
                                                rowStyle: rowData => ({
                                                    backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                                                  }),
                                                  headerStyle: {
                                                    backgroundColor: '#079b',
                                                    color: '#EEE'
                                                  },
                                            }}
                                            
                                        />
                                    ) : (
                                            <Grid container spacing={2} item xs={12}>
                                                {/* <Grid item xs={12} style={{backgroundColor:"#424242", color:"#FFF", maxHeight: '20vh', overflow: 'auto'}}>
                                                    {hierarchicalVisData.map((vlan, i) => (
                                                        <Chip
                                                            // key={i}
                                                            label={vlan.label}
                                                            color="primary"
                                                            // clickable
                                                            style={{ margin: "7px" }}
                                                            onClick={handleChipClick.bind(vlan)}
                                                        // onClick={handleClick}
                                                        />
                                                    ))}
                                                </Grid> */}
                                                <Grid conatiner spacing={2} item xs={3}>
                                                    <Grid item>
                                                        <Card style={{ backgroundColor: "#424242", color: "#FFF", marginBottom: "10px", padding: "10px" }}>
                                                            <Typography variant={'h5'}>Select VLAN</Typography>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item>
                                                        <List style={{ backgroundColor: "#424242", color: "#FFF", maxHeight: '73.5vh', overflow: 'auto' }}>
                                                            {hierarchicalVisData.map((vlan, i) => (
                                                                <ListItem key={i} button onClick={handleChipClick.bind(vlan)}>
                                                                    <ListItemText primary={vlan.label} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Grid>

                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Graph
                                                        style={{ height: "80vh", background: "#424242" }}
                                                        graph={visGraphData}
                                                        options={options}
                                                        events={events}
                                                        getNetwork={(network) => {
                                                            //  if you want access to vis.js network api you can set the state in a parent component using this property
                                                            // network.on("selectNode", function (params) {
                                                            //     if (params.nodes.length === 1) {
                                                            //         if (network.isCluster(params.nodes[0]) === true) {
                                                            //             network.openCluster(params.nodes[0]);
                                                            //         }
                                                            //     }
                                                            // });
                                                            network.on("hoverNode", function (properties) {
                                                                console.log("hoverNode Event:", properties);
                                                                console.log(network);
                                                            });
                                                            network.on("blurNode", function (properties) {
                                                                console.log("blurNode Event:", properties);
                                                            });
                                                            // hierarchicalVisData.forEach(vlan => {
                                                            //     vlan.subnet.forEach(subnet => {
                                                            //         subnet.devices.forEach(device=>{
                                                            //             console.log(vlan.label);
                                                            //             network.clusterOutliers();   
                                                            //         })
                                                            //     })
                                                            // })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <MaterialTable
                                                        title={tableTitle}
                                                        columns={tableContent.columns}
                                                        data={tableContent.data}
                                                        options={{
                                                            backgroundColor: "#E6E6E6",
                                                            headerStyle: {
                                                                backgroundColor: '#E6E6E6',
                                                            }, rowStyle: {
                                                                backgroundColor: '#E6E6E6',
                                                            },
                                                            cellStyle: {
                                                                backgroundColor: '#E6E6E6',
                                                            }
                                                        }}
                                                        style={{
                                                            backgroundColor: "#E6E6E6",
                                                        }}
                                                        detailPanel={
                                                            rowData => {
                                                                return (
                                                                    <Container style={{ padding: "20px", backgroundColor: "#BFBFBF" }}>
                                                                        <MaterialTable
                                                                            title="VLAN subnets"
                                                                            columns={[
                                                                                { title: 'IP', field: 'ip' },
                                                                                { title: 'Mask', field: 'mask' },
                                                                            ]}
                                                                            data={rowData.subnets}
                                                                            detailPanel={
                                                                                rowData => {
                                                                                    return (
                                                                                        <Container style={{ padding: "20px", backgroundColor: "#808080" }}>
                                                                                            <MaterialTable
                                                                                                title="Devices"
                                                                                                columns={[
                                                                                                    { title: 'IP Address', field: 'ip' },
                                                                                                    { title: 'MAC Address', field: 'mac' },
                                                                                                    { title: 'Name', field: 'name' },
                                                                                                    { title: 'Vendor', field: 'vendor' },
                                                                                                    { title: 'Device Type', field: 'type' },
                                                                                                    { title: 'SNMP Community', field: 'snmpCommunity' },
                                                                                                    { title: 'SNMP Enabled', field: 'snmpEnabled' },
                                                                                                ]}
                                                                                                data={rowData.devices}
                                                                                                options={{
                                                                                                    backgroundColor: "#808080",
                                                                                                    color: "#FFF",
                                                                                                    headerStyle: {
                                                                                                        backgroundColor: '#808080',
                                                                                                        color: '#FFF'
                                                                                                    }, rowStyle: {
                                                                                                        backgroundColor: '#808080',
                                                                                                    },
                                                                                                    cellStyle: {
                                                                                                        backgroundColor: '#808080',
                                                                                                        color: '#FFF'
                                                                                                    },
                                                                                                    paging: false,
                                                                                                    search: false,
                                                                                                }}
                                                                                                style={{
                                                                                                    backgroundColor: "#808080",
                                                                                                    color: "#FFF"
                                                                                                }}
                                                                                            />
                                                                                        </Container>
                                                                                    )
                                                                                }
                                                                            }
                                                                            options={{
                                                                                backgroundColor: "#A6A6A6",
                                                                                headerStyle: {
                                                                                    backgroundColor: '#A6A6A6',
                                                                                }, rowStyle: {
                                                                                    backgroundColor: '#A6A6A6',
                                                                                },
                                                                                cellStyle: {
                                                                                    backgroundColor: '#A6A6A6',
                                                                                },
                                                                                paging: false,
                                                                                search: false,
                                                                            }}
                                                                            style={{
                                                                                backgroundColor: "#A6A6A6",
                                                                            }}
                                                                        />
                                                                    </Container>
                                                                )
                                                            }
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                </Grid>
                                <Grid item xs={12} style={{ marginBottom: "50px" }}>
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
