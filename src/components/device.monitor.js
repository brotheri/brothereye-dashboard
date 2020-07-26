import React, { useState, useEffect } from "react";
import axios from "axios";
import AppBarWithDrawer from "../components/Vis page/material.appbar.drawer";
import { Container, Grid, Typography, CardContent, Card, Avatar, CardHeader, Divider, List, ListItem, ListItemText } from "@material-ui/core";
import MaterialTable from 'material-table';
import { makeStyles } from "@material-ui/core/styles";
import FolderRoundedIcon from '@material-ui/icons/FolderRounded';
import DataUsageRoundedIcon from '@material-ui/icons/DataUsageRounded';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';

import Box from '@material-ui/core/Box';
import Copyright from "../components/copyrights"

import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: "xl",
        marginTop: "15px",
    },
    gridContainer: {
        marginTop: "100px"
    },
    table: {
        backgroundColor: "#424242",
        color: "#FFF"
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    cardContainer: {
        flexGrow: "1",
        backgroundColor: "#4F4F4F",
    },
    dividerColor: {
        backgroundColor: "white"
    },
}));
export default function DeviceMonitor() {
    const classes = useStyles();
    console.log(localStorage.getItem("deviceID"));

    const [appTheme, setAppTheme] = useState(localStorage.getItem("appTheme"));

    const [deviceData, setDeviceData] = useState({ monitorData: {} });
    const [totalQuota, setTotalQuota] = useState("");
    const [monthData, setMonthData] = useState([]);
    const [partitionData, setPartitionData] = useState([]);
    const [IOMonitor, setIOMonitor] = useState(false);
    const [hostMonitor, setHostMonitor] = useState(false);

    useEffect(() => {
        axios.get('http://193.227.38.177:3000/api/v1/monitor/device/' + localStorage.getItem("deviceID"), {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then((res) => {
            console.log(res.data);

            if (res.data.totalQuota && res.data.monthData) {
                console.log(res.data);
                setDeviceData(res.data.device);
                setTotalQuota(res.data.totalQuota);
                const tempMonthData = res.data.monthData.map((val) => {
                    return {
                        timestamp: new Date(val.timestamp).toLocaleDateString(),
                        upData: val.upData / 1e6,
                        downData: val.downData / 1e6
                    }
                })
                setMonthData(tempMonthData);
                setIOMonitor(true);
            }

            if (res.data.device.monitorData) {
                console.log(res.data.device.monitorData);
                const tempPartitionData = res.data.device.monitorData.partitions.map((val) => {
                    return {
                        name: val.name,
                        size: val.size,
                        used: val.used,
                        util: Number(val.util).toFixed(2)
                    }
                })
                setPartitionData(tempPartitionData);
                setHostMonitor(true);
            }
        });
    }, [])



    console.log(monthData);
    return (
        <Container className={classes.root}>
            <AppBarWithDrawer />
            <Grid container spacing={2} className={classes.gridContainer}>
                {(hostMonitor && IOMonitor) ? (
                    <Grid item xs={5} >
                        <Card >
                            <CardHeader
                                title={
                                    <Typography variant="h5">
                                        Device Data
                                </Typography>
                                }
                            />
                            <CardContent >
                               
                                <Typography gutterBottom>Download speed : <Typography  style ={{display:'inline', color:'green'}}>{deviceData.downSpeed ? deviceData.downSpeed.toFixed(2) / 1000 : 0} kb/sec</Typography></Typography>
                                <Typography gutterBottom>Upload speed   : <Typography  style ={{display:'inline', color:'red'}}>{deviceData.upSpeed ? deviceData.upSpeed.toFixed(2) / 1000 : 0} kb/sec</Typography></Typography>
                                <Typography gutterBottom>Vendor         : <Typography  style ={{display:'inline', color:'#079b'}}>{deviceData.vendor}</Typography></Typography>
                                {/* <Typography>SNMP enabled : {deviceData.snmpEnabled}</Typography> */}
                                <Typography gutterBottom>Up time        : <Typography  style ={{display:'inline', color:'#079b'}}>{Number(Number(deviceData.monitorData.upTime) / 60).toFixed(2)} hours</Typography></Typography>
                                <Typography gutterBottom>Total RAM      : <Typography  style ={{display:'inline', color:'#079b'}}>{deviceData.monitorData.ram}</Typography></Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (null)}
                {IOMonitor ? (
                    <Grid style={{margin: 'auto'}} item xs={3}>
                        <Card  >
                            <CardHeader
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }} 
                                avatar={<Avatar style ={{backgroundColor:'#079b'}} className={classes.large}>
                                    <ImportExportRoundedIcon fontSize="large" />
                                </Avatar>}
                                title={
                                    <Typography style ={{ color:parseFloat(totalQuota) < 5 ?'green' : 'red'}} variant="h4">
                                        {totalQuota}
                                    </Typography>
                                }
                                subheader={
                                    <Container>
                                        <Typography>
                                            Total quota used
                                </Typography>
                                        {/* <AreaChart width={130} height={100} data={monthData.slice(20,-1)} >
                                        <Area type='monotone' dataKey='upData' stroke='#8884d8' fill='#8884d8' />
                                        <Area type='monotone' dataKey='downData' stroke='#82ca9d' fill='#82ca9d' />
                                    </AreaChart> */}
                                    </Container>

                                }
                            />
                            {/* <CardContent>
                            <AreaChart width={250} height={100} data={monthData} margin={{ top: 0, right: 3, left: 3, bottom: 0 }}>
                                <Area type='monotone' dataKey='upData' stroke='#8884d8' fill='#8884d8' />
                                <Area type='monotone' dataKey='downData' stroke='#82ca9d' fill='#82ca9d' />
                            </AreaChart>
                        </CardContent> */}
                        </Card>
                    </Grid>
                ) : (null)}
                {hostMonitor ? (
                    <Grid item xs={4} >
                        <Card style={{height:'250px'}}>
                            <CardHeader
                                title={
                                    <Typography variant="h5" >
                                        Detected Blocked Programs
                                </Typography>
                                }
                            />
                            <CardContent>
                                {deviceData.monitorData.blockedPrograms ? (
                                    <List >
                                        {deviceData.monitorData.blockedPrograms.map((program, i) => (
                                            <ListItem key={i}>
                                                <ListItemText style={{color: i%2? 'red':'grey', textAlign:'center'}} primary={program} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (null)}
                                {/* {deviceData.monitorData.blockedPrograms} */}
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (null)}
                <Grid item xs={12} >
                    <Divider classes={{ root: classes.dividerColor }} />
                </Grid>
                {IOMonitor ? (
                    <Grid item xs={6}>
                        <Card>
                            <CardHeader
                                title={
                                    <Typography variant="h5">
                                        Download data in MB
                                </Typography>
                                }
                            />
                            <CardContent>
                                <LineChart
                                    width={550}
                                    height={300}
                                    data={monthData}
                                    margin={{
                                        top: 10, right: 10, left: 50, bottom: 10,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" angle={10} textAnchor="start" />
                                    <YAxis dataKey="downData" angle={-45} label={{ value: "Data used in MB", angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" fill='green' dataKey="downData" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (null)}
                {IOMonitor ? (
                    <Grid item xs={6}>
                        <Card>
                            <CardHeader
                                title={
                                    <Typography variant="h5">
                                        Upload data in MB
                                </Typography>
                                }
                            />
                            <CardContent>
                                <LineChart
                                    width={550}
                                    height={300}
                                    data={monthData}
                                    margin={{
                                        top: 10, right: 10, left: 50, bottom: 10,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" angle={10} textAnchor="start" />
                                    <YAxis dataKey="upData" angle={-45} label={{ value: "Data used in MB", angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" fill='red' dataKey="upData" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (null)}
                <Grid item xs={12} >
                    <Divider classes={{ root: classes.dividerColor }} />
                </Grid>
                {hostMonitor ? (
                    <Grid item xs={12}>

                        <MaterialTable
                            title="Device Partitions"
                            columns={[
                                // { field:'icon', render:rowData=><FolderRoundedIcon/>, cellStyle: {width: 5, maxWidth: 5}, headerStyle: { width:5, maxWidth: 5}},
                                { title: "Partition Name", field: 'name' },
                                { title: "Partition Size", field: 'size' },
                                { title: "Partition Size Used", field: 'used' },
                                { title: "Partition Utilization Percentage", field: 'util' },
                            ]}
                            data={partitionData}
                            
                            options={{
                                search: false,
                                paging: false,
                                
                                  headerStyle: {
                                    backgroundColor: '#079b',
                                    color: '#EEE'
                                  },
                            }}
                        />
                    </Grid>
                ) : (null)}

                <Container style={{ marginBottom: "50px" }}>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Container>
            </Grid>
        </Container >

    );
}