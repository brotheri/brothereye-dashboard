import React, { useState, useEffect } from "react";
import AppBarWithDrawer from "../components/Vis page/material.appbar.drawer";
import BarRechart from "../components/bar.rechart"
import DoughnutRechart from "../components/doughnut.rechart"
import axios from "axios";
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Divider, Grid, CardContent, Card, Avatar, CardHeader, Backdrop, CircularProgress } from "@material-ui/core";
import MaterialTable from "material-table";

import {
    BarChart, RadialBarChart, RadialBar, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import Box from '@material-ui/core/Box';
import Copyright from "../components/copyrights"

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


    const colors = [scaleOrdinal(schemeCategory10).range()[0], scaleOrdinal(schemeCategory10).range()[3]];


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
                            <Grid item xs={12} >
                            <Typography variant={"h5"} style={{color:"white"}}>
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
                                            <YAxis type="number" domain={[0, 300]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="totalQuota" fill='#079b'  >
                                                {
                                                    barGraphData.map((entry, index) => (
                                                       // <Cell key={`cell-${index}`} fill={colors[index % 2]} />
                                                      
                                                    <Cell fill={index % 2? '#079b' : 'grey' }/>


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
                                            width={600}
                                            height={500}

                                            innerRadius="10%"
                                            outerRadius="90%"
                                            data={barGraphData}
                                            startAngle={180}
                                            endAngle={0}
                                            
                                            
                                        >
                                        

                                            <RadialBar minAngle={15} label={{ fill: '#fff', position: 'insideStart' }} background clockWise={true} dataKey='totalQuota'>
                                            {
                                            barGraphData.map((entry, index) => (
                                              <Cell fill={entry.totalQuota <= 25 
                                                  ? '#089c19' // green
                                                  : entry.totalQuota <= 50 
                                                      ? '#d4bb02'  //yellow
                                                      : entry.totalQuota <= 75
                                                          ? '#d48402' //orange
                                                          : '#d41002' }/> //red
                                          ))
                                        }
                                                </RadialBar>

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
                                />
                            </Grid>
                        </Grid>
                    )}

            </Grid>
            <Container style={{ marginBottom: "50px" }}>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </Container>
    );
}
