import React, { useState, useEffect } from "react";
import Graph from "react-graph-vis";
import axios from "axios";
import Copyright from "../components/copyrights";
import AppBarWithDrawer from "../components/material.appbar.drawer";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

import MaterialTable from 'material-table';

// Switch styling
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

// Other components styling
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: "xl",
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

/*
Function that takes VLAN data, filters them and return an array of objects that satisify vis network data object
Return array: [0:{id:"Unique id",label:"VLAN label that will appear in the vis network",group:"A group that will have the same node properties in vis network",
subnet:[0:{label:"Subnet label that will appear in the vis network", id:"Unique id different than that of the VLAN and those of the devices", group:"A group that willhave the same node properties in the vis network", 
devices:[0:{label:"Device label that will appear in the vis network", id:"Unique id different than that of the VLANs and subnets", group:"A group that will have the same node properties in vis network", 
color:{background:"Node back ground color representing if the device is exceeder or idle", border:"Node border color"}}]}]}]
*/
function CreateVisArray(vlanData) {
    let uid = 1;

    const devices = vlanData.map((vlan, vi) => {
        let exceeders = (JSON.parse(localStorage.getItem("exc") || "[]")); // Retrieve list of exceeders stored in local storage under name of exc
        return {
            label: "VLAN : " + vlan.name,
            id: uid++,
            group: "vlan", 
            subnet: vlan.subnets.map((sub, si) => {
                let thisubId = uid++;
                return {
                    label: "Subnet : " + sub.ip + "\nMask: " + sub.mask,
                    id: thisubId,
                    group: "switch",
                    devices: sub.devices.map((val, di) => {
                        let nodeColor = '';
                        if (exceeders.some((mac) => mac === val.mac)) { // Compare the mac of the current device if exists in the list of exceeders
                            nodeColor = "#FF0000"; // Red color if true, indicating exceeder
                        }
                        else {
                            nodeColor = "#008000" // Green color if false, indicating idle
                        }
                        return {
                            label: "Device : " + val.ip,
                            id: uid++,
                            group: "PC",
                            color: {
                                background: nodeColor,
                                border: "black",
                            }
                        }
                    })
                }
            })
        }
    })
    return devices;
}

export default function Vis() {
    const classes = useStyles(); // Variable used to asign styles to components using className property
    const history = useHistory(); // Used for page redirecting

    const [visGraphData, setVisGraphData] = useState({
        nodes: [], // Vis network array containing nodes data and options
        edges: [], // Vis network array containing links between nodes, [0:{from:"node id",to:"node id"}]
    });

    const [selectedVlan, setVlanTitle] = useState(null); // Variable used to set the name of the selected VLAN in the vis network
    const [hierarchicalVisData, setHierarchicalVisData] = useState([]); // Variable that is used to store the return of CreateVisArray function
    const [loading, setLoading] = useState(true); // Variable indicating if the data is loading or done

    const [open, setOpen] = React.useState(false);

    const anchorRef = React.useRef(null);
    const [tableContent, setTableContent] = React.useState({}); // Variable to store VLAN data for the table
    const [tableTitle, setTableTitle] = React.useState(""); // Variable to store table title
    const [switchMonitor, setSwitchMonitor] = React.useState({ // Variable to store switch value
        devices: false
    });

    let pc = "Icons/computer (1).png";
    let server = "Icons/server.png";
    let router = "Icons/router (1).png";

    // Function that handle the press of the switch
    const handleChange = (event) => {
        setSwitchMonitor({ ...switchMonitor, [event.target.name]: event.target.checked });
        setLoading(true);
    };

    // Function responsible for calling APIs and assiging the data to each responsible variable
    const pollfn = () => {
        if (!switchMonitor.devices) {
            axios.get(`http://193.227.38.177:3000/api/v1/discover/vlans`, { // Discover VLAN API
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                const data = res.data;
                if (data.value) { // If still discovering, wait then call the same function again
                    setTimeout(pollfn, 20 * 1000);
                    return;
                }
                setTableContent({ // Set the table data with the retreived VLAN data
                    columns: [
                        { title: 'Name', field: 'name' } // Column [{title:"the title that will appear on the table", field:"A key word that maps to the value in the JSON stirng"}]
                    ],
                    data: res.data.vlans, // Table data
                })
                setHierarchicalVisData(CreateVisArray(res.data.vlans)); // Storing the value of CreateVisArray function
                setLoading(false); // Indicating end of loading
                setTableTitle("VLANs"); // Setting table title to VLANs
            });
        }
        else {
            axios.get(`http://193.227.38.177:3000/api/v1/discover/devices`, { // Discover device API
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                const data = res.data;
                if (data.value) { // If still discovering, wait then call the same function again
                    setTimeout(pollfn, 20 * 1000);
                    return;
                }
                console.log(res.data.nodes);
                let nodes = res.data.nodes.map((node) => { // Rename SNMP community
                    return {
                        ...node,
                        snmpCommunity: node.snmpEnabled ? node.snmpCommunity : "N/A"
                    }
                });
                setTableContent({ // Set the table data with the retreived device data
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
                    data: nodes, // Table data
                })
                setLoading(false); // Indicating end of loading
                setTableTitle("Devices"); // Setting table title to devices
            });
        }
    }

    useEffect(pollfn, [switchMonitor.devices]);

    // Redirect to monitor device if device selected
    const monitorDevice = (selectedRow) => {
        console.log(selectedRow._id);
        if (selectedRow.monitored) {
            localStorage.setItem("deviceID", selectedRow._id);
            history.push('/Device Monitor');
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

    // Vis network options
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
                imagePadding: 7
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

    // Gets triggered when an item in the list of available VLANs is clicked
    const handleListClick = function () {
        let visData = [];
        let visLink = [];
        let vlanData = this;
        
        // Flatten the array to make them 1 level
        visData.push({ ...vlanData, subnet: undefined });
        vlanData.subnet.forEach(subnet => {
            visLink.push({ from: vlanData.id, to: subnet.id })
            visData.push({ ...subnet, devices: undefined })
            subnet.devices.forEach(device => {
                visLink.push({ from: subnet.id, to: device.id })
                visData.push(device)
            })
        })

        // Dispaly the name of the selected VLAN
        setVlanTitle(vlanData.label);
        setVisGraphData({
            nodes: visData,
            edges: visLink
        })
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
                                <Grid item xs={12}>
                                    {switchMonitor.devices ? (
                                        <MaterialTable
                                            title={tableTitle}
                                            columns={tableContent.columns}
                                            data={tableContent.data}
                                            onRowClick={(event, selectedRow) => monitorDevice(selectedRow)}
                                            options={{
                                                sorting: true,
                                                headerStyle: {
                                                    backgroundColor: '#079b',
                                                    color: '#EEE'
                                                },
                                            }}
                                        />
                                    ) : (
                                            <Grid container spacing={2} item xs={12}>
                                                <Grid conatiner spacing={2} item xs={3}>
                                                    <Grid item>
                                                        <Card style={{ backgroundColor: "#424242", color: "#FFF", marginBottom: "10px", padding: "10px" }}>
                                                            <Typography variant={'h5'}>Select VLAN</Typography>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item>
                                                        <List style={{ backgroundColor: "#424242", color: "#FFF", height: '80vh', overflow: 'auto' }}>
                                                            {hierarchicalVisData.map((vlan, i) => (
                                                                <ListItem key={i} button onClick={handleListClick.bind(vlan)}>
                                                                    <ListItemText primary={vlan.label} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Grid>

                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Grid item xs={12} style={{ background: "#424242", padding: '15px' }}>
                                                        <Typography variant={"h5"} style={{ color: "white" }}>
                                                            {selectedVlan ? selectedVlan : ''}
                                                        </Typography>
                                                    </Grid>
                                                    <Graph
                                                        style={{ height: "80vh", background: "#424242" }}
                                                        graph={visGraphData}
                                                        options={options}
                                                        getNetwork={(network) => {
                                                            network.on("hoverNode", function (properties) {
                                                                console.log("hoverNode Event:", properties);
                                                                console.log(network);
                                                            });
                                                            network.on("blurNode", function (properties) {
                                                                console.log("blurNode Event:", properties);
                                                            });
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
