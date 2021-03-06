import React, { useState, useEffect } from "react";
import AppBarWithDrawer from "../components/material.appbar.drawer";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Divider, Grid, Card, Avatar, CardHeader, Backdrop, CircularProgress, List, ListItem, ListItemText } from "@material-ui/core";
import MaterialTable from "material-table";

import { BarChart, RadialBarChart, RadialBar, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import Box from '@material-ui/core/Box';
import Copyright from "../components/copyrights"

import DesktopWindowsRoundedIcon from '@material-ui/icons/DesktopWindowsRounded';
import RouterRoundedIcon from '@material-ui/icons/RouterRounded';

// Components styling
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: "xl",
        marginTop: "15px",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: "white",
        backgroundColor: "#424242"
    },
    card: {
        backgroundColor: "#424242",
        color: "#ffffff",
        margin: "auto",
        justifyContent: "center",
        alignItems: "center"
    },
    typography: {
        padding: "25px"
    },
    dividerColor: {
        backgroundColor: "white"
    },
    gridContainer: {
        marginTop: "100px"
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
}));

// Main function responsible for dashboard page
export default function Dashboard() {
    const classes = useStyles();

    const [exceedTableContent, setExceedTableContent] = React.useState({}); // Variable to hold exceeders table data
    const [loading, setLoading] = useState(true); // Variable indicating whether loading is done or not
    const [blockedTableContent, setBlockedTableContent] = React.useState({}); // Variable to hold devices having blocked program table data
    const [countDevices, setCountDevices] = useState(''); // Devices number
    const [countVLANs, setCountVLANs] = useState(''); // VLANs number
    const [barGraphData, setBarGraphData] = useState({}); // Bar graph data

    // Function responsible for calling APIs and assiging the data to each responsible variable
    const pollfn = () => {
        // Your code here
        axios.get(`http://193.227.38.177:3000/api/v1/discover/dashboard`, { // Get dashboard data API
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then((res) => {
            const data = res.data;
            if (data.value) { // If still discovering, wait then call the same function again
                setTimeout(pollfn, 20 * 1000);
                return;
            }
            setExceedTableContent({ // Set the table data with the retreived exceeders data
                columns: [
                    { title: 'IP Address', field: 'currIp' },
                    { title: 'MAC Address', field: 'mac' },
                    { title: 'Name', field: 'name' },
                    { title: 'Quota used', field: 'totalQuota' },
                    { title: 'Vendor', field: 'vendor' },
                    { title: 'Device Type', field: 'type' },
                ],
                data: res.data.exceeders,
            });
            localStorage.setItem("exc", JSON.stringify(res.data.exceeders.map(x => x.mac))); // Store exceeders mac address
            setBlockedTableContent({ // Set the table data with the retreived blocked devices data
                columns: [
                    { title: 'IP Address', field: 'currIp' },
                    { title: 'MAC Address', field: 'mac' },
                    { title: 'Name', field: 'name' },
                    { title: 'Vendor', field: 'vendor' },
                    { title: 'Device Type', field: 'type' },
                ],
                data: res.data.devsWithBlockedProgs,
            })
            setCountDevices(res.data.deviceCount); // Set number of devices
            setCountVLANs(res.data.vlanCount); // Set number of VLANs
            const tempGraphData = res.data.exceeders.map((device) => { // Removing total quota measuring unit from the string and preparing the data for the bar graph
                return {
                    name: device.name,
                    totalQuota: Number((device.totalQuota.split(" "))[0]).toFixed(2)
                }
            })
            setBarGraphData(tempGraphData); // Setting bar graph data
            setLoading(false); // Stating end of retreiving data
        });
    }

    useEffect(pollfn, []);
    const style = {
        top: 20,
        left: 400,
        lineHeight: '15px',
    };

    return (
        <Container className={classes.root}>
            <AppBarWithDrawer />
            <Grid container spacing={2} className={classes.gridContainer}>
                {loading ? (
                    <Grid item xs={12}>
                        <Backdrop open={loading}>
                            <CircularProgress color="secondary" />
                        </Backdrop>
                    </Grid>
                ) : (
                        <Grid item xs={12} container spacing={2}>
                            <Grid container item xs={12} spacing={3} style={{ flexGrow: "1", alignContent: "center", justifyContent: "center" }}>
                                <React.Fragment>
                                    <Grid item xs={4}>
                                        <Card >
                                            <CardHeader
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                avatar={<Avatar style={{ backgroundColor: "#079b" }} className={classes.large}>
                                                    <DesktopWindowsRoundedIcon fontSize="large" />
                                                </Avatar>}
                                                title={
                                                    <Typography variant="h4" style={{ color: "green" }}>
                                                        {countDevices}
                                                    </Typography>
                                                }
                                                subheader={
                                                    <Typography >
                                                        Online Devices
                                                    </Typography>
                                                }
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card >
                                            <CardHeader
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                avatar={<Avatar style={{ backgroundColor: "#079b" }} className={classes.large}>
                                                    <RouterRoundedIcon fontSize="large" />
                                                </Avatar>}
                                                title={
                                                    <Typography variant="h4" style={{ color: "red" }}>
                                                        {countVLANs}
                                                    </Typography>
                                                }
                                                subheader={
                                                    <Typography>
                                                        Available VLANs
                                                    </Typography>
                                                }
                                            />
                                        </Card>
                                    </Grid>
                                </React.Fragment>
                            </Grid>
                            <Grid item xs={12} >
                                <Divider classes={{ root: classes.dividerColor }} />
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant={"h5"} style={{ color: "white" }}>
                                    Devices Exceeding Quota Limit
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid item xs={12}>
                                    <Card>
                                        <BarChart
                                            width={580}
                                            height={500}
                                            data={barGraphData}
                                            margin={{
                                                top: 50, right: 5, left: 0, bottom: 10,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis type="number" domain={[0, Math.max(...barGraphData.map(item => Math.ceil(parseFloat(item.totalQuota))))]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="totalQuota" fill='#079b'  >
                                                {
                                                    barGraphData.map((entry, index) => (
                                                        // <Cell key={`cell-${index}`} fill={colors[index % 2]} />

                                                        <Cell fill={index % 2 ? '#079b' : 'grey'} />


                                                    ))
                                                }
                                            </Bar>
                                        </BarChart>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid item xs={12}>
                                    <Card>
                                        <RadialBarChart
                                            width={400}
                                            height={500}
                                            innerRadius="10%"
                                            outerRadius="80%"
                                            data={JSON.parse(JSON.stringify(barGraphData)).sort((a, b) => (parseFloat(a.totalQuota) > parseFloat(b.totalQuota)) ? 1 : -1)}
                                            startAngle={210}
                                            endAngle={-30}
                                            cx={200}
                                            cy={250}
                                        >
                                            <RadialBar minAngle={15} label={{ fill: '#000', position: 'insideStart' }} background clockWise={true} dataKey='totalQuota'>
                                                {
                                                    JSON.parse(JSON.stringify(barGraphData)).sort((a, b) => (parseFloat(a.totalQuota) > parseFloat(b.totalQuota)) ? 1 : -1).map((entry, index) => (
                                                        <Cell fill={entry.totalQuota <= 0.25 * Math.max(...barGraphData.map(item => Math.ceil(parseFloat(item.totalQuota))))
                                                            ? '#089c19' // green
                                                            : entry.totalQuota <= 0.50 * Math.max(...barGraphData.map(item => Math.ceil(parseFloat(item.totalQuota))))
                                                                ? '#d4bb02'  //yellow
                                                                : entry.totalQuota <= 0.75 * Math.max(...barGraphData.map(item => Math.ceil(parseFloat(item.totalQuota))))
                                                                    ? '#d48402' //orange
                                                                    : '#d41002'} /> //red
                                                    ))
                                                }
                                            </RadialBar>
                                            <Legend iconSize={10} width={180} height={120} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                                            <Tooltip />
                                        </RadialBarChart>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <MaterialTable
                                    title="Devices Exceeding Quota Limit"
                                    columns={exceedTableContent.columns}
                                    data={exceedTableContent.data}
                                    options={{
                                        backgroundColor: "#E6E6E6",
                                        headerStyle: {
                                            backgroundColor: '#079b',
                                            color: '#EEE'
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <Divider classes={{ root: classes.dividerColor }} />
                            </Grid>
                            <Grid item xs={12}>
                                <MaterialTable
                                    title="Devices Having Blocked Programs"
                                    columns={blockedTableContent.columns}
                                    data={blockedTableContent.data}
                                    options={{
                                        backgroundColor: "#E6E6E6",
                                        headerStyle: {
                                            backgroundColor: '#079b',
                                            color: '#EEE'
                                        },
                                    }}
                                    detailPanel={
                                        rowData => {
                                            return (
                                                <Container style={{ padding: "20px", backgroundColor: "#BFBFBF" }}>
                                                    <Typography variant="h5">Programs</Typography>
                                                    <List>
                                                        {rowData.monitorData.blockedPrograms.map((program, i) => (
                                                            <ListItem key={i}>
                                                                <ListItemText primary={program} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Container>
                                            )
                                        }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Container style={{ marginBottom: "50px" }}>
                                    <Box mt={8}>
                                        <Copyright />
                                    </Box>
                                </Container>
                            </Grid>
                        </Grid>
                    )}
            </Grid>
        </Container>
    );
}
