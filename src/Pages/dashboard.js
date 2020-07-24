import React, { useState, useEffect } from "react";
import AppBarWithDrawer from "../components/Vis page/material.appbar.drawer";
import BarRechart from "../components/bar.rechart"
import DoughnutRechart from "../components/doughnut.rechart"
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Divider, Grid, CardContent, Card, Avatar, CardHeader, Backdrop, CircularProgress } from "@material-ui/core";
import MaterialTable from "material-table";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


import DesktopWindowsRoundedIcon from '@material-ui/icons/DesktopWindowsRounded';
import RouterRoundedIcon from '@material-ui/icons/RouterRounded';

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

export default function Dashboard() {
    const classes = useStyles();

    const [appTheme, setAppTheme] = useState(localStorage.getItem("appTheme"));
    const [exceedTableContent, setExceedTableContent] = React.useState({});
    const [loading, setLoading] = useState(true);
    const [blockedTableContent, setBlockedTableContent] = React.useState({});
    const [countDevices, setCountDevices] = useState('');
    const [countVLANs, setCountVLANs] = useState('');
    const [barGraphData, setBarGraphData] = useState({});

    const pollfn = () => {
        // Your code here
        axios.get(`http://193.227.38.177:3000/api/v1/discover/dashboard`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then((res) => {
            const data = res.data;
            if (data.value) {
                setTimeout(pollfn, 20 * 1000);
                return;
            }
            setExceedTableContent({
                columns: [
                    { title: 'IP Address', field: 'currIp' },
                    { title: 'MAC Address', field: 'mac' },
                    { title: 'Name', field: 'name' },
                    { title: 'Quota used', field: 'totalQuota' },
                    { title: 'Vendor', field: 'vendor' },
                    { title: 'Device Type', field: 'type' },
                ],
                data: res.data.exceeders,
            })
            setBlockedTableContent({
                columns: [],
                data: res.data.devsWithBlockedProgs,
            })
            setCountDevices(res.data.deviceCount);
            setCountVLANs(res.data.vlanCount);
            const tempGraphData = res.data.exceeders.map((device) => {
                return {
                    name: device.name,
                    totalQuota: Number((device.totalQuota.split(" "))[0]).toFixed(2)
                }
            })
            setBarGraphData(tempGraphData);
            console.log(tempGraphData);
            setLoading(false);
        });
    }

    useEffect(pollfn, []);

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
                                                avatar={<Avatar className={classes.large}>
                                                    <DesktopWindowsRoundedIcon fontSize="large" />
                                                </Avatar>}
                                                title={
                                                    <Typography variant="h4">
                                                        {countDevices}
                                                    </Typography>
                                                }
                                                subheader={
                                                    <Typography>
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
                                                avatar={<Avatar className={classes.large}>
                                                    <RouterRoundedIcon fontSize="large" />
                                                </Avatar>}
                                                title={
                                                    <Typography variant="h4">
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
                                    {/* <Grid item xs={4}>
                                        <Card className={classes.Card}>
                                        <BarRechart/>
                                        </Card>
                                        
                                    </Grid> */}
                                </React.Fragment>
                            </Grid>

                            {/* <Grid item xs={6}>
                                <ColumnChart />
                            </Grid>
                            <Grid item xs={6}>
                                <ChartViewer />
                            </Grid> */}
                            <Grid item xs={12} >
                                <Divider classes={{ root: classes.dividerColor }} />
                            </Grid>
                            <Grid item xs={7}>
                                <MaterialTable
                                    title="Devices Exceeding Quota Limit"
                                    columns={exceedTableContent.columns}
                                    data={exceedTableContent.data}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <Card>
                                    <BarChart
                                        width={500}
                                        height={700}
                                        data={barGraphData}
                                        margin={{
                                            top: 50, right: 20, left: 0, bottom: 10,
                                        }}

                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis  />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalQuota" barSize={18} />
                                    </BarChart>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <MaterialTable
                                    title="Devices Having Blocked Programs"
                                    columns={blockedTableContent.columns}
                                    data={blockedTableContent.data}
                                />
                            </Grid>
                        </Grid>
                    )}

            </Grid>
        </Container>
    );
}
