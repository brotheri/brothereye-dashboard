import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";
import MaterialTable from 'material-table';
import axios from "axios";
import AppBarWithDrawer from "../components/Vis page/material.appbar.drawer";
import Alert from '@material-ui/lab/Alert';

import Box from '@material-ui/core/Box';
import Copyright from "../components/copyrights"


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
    }
}));

export default function Settings() {
    const classes = useStyles();
    const [selectedRow, setSelectedRow] = useState(null);
    
    const [appTheme,setAppTheme] = useState(localStorage.getItem("appTheme"));

    const [tableContent, setTableContent] = React.useState({
        columns: [
            { title: 'Blocked Word', field: 'name' },
        ],
        data: [],
    });
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);

    useEffect(() => {
        axios.get('http://193.227.38.177:3000/api/v1/settings/blocklist', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then((res) => {
            setTableContent({
                columns: [
                    { title: 'Blocked Word', field: 'name' }
                ],
                data: res.data.list
            })
        })
    }, [])

    const handleRowAdd = (newData, resolve) => {
        if (newData.name === undefined) {
            setErrorMsg(["Please enter a word to be blocked"]);
            setError(true);
            resolve();
        }
        else {
            axios.post(`http://193.227.38.177:3000/api/v1/settings/blocklist`, { name: newData.name }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                console.log(res.data);
                setTimeout(() => {
                    resolve();
                    setTableContent((prevState) => {
                        const data = [...prevState.data];
                        data.push(newData);
                        return { ...prevState, data };
                    });
                }, 600);
            });
        }
    }

    const handleRowDelete = (oldData, resolve) => {
        axios.delete("http://193.227.38.177:3000/api/v1/settings/blocklist/" + oldData._id, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
            .then(res => {
                setTimeout(() => {
                    resolve();
                    setTableContent((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                    });
                }, 600);
            })
            .catch(error => {
                setErrorMsg(["Delete failed! Server error"])
                setError(true)
                resolve()
            })
    }

    

    // function monitorDevice(deviceID) {
    //     console.log(deviceID);
    //     localStorage.setItem("deviceID",deviceID);
    //     return (
    //         <Redirect to='/Device Monitor'></Redirect>
    //     )
    // }

    return (
        <Container className={classes.root}>
            <AppBarWithDrawer />
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                    {error ? (<Alert severity="error">
                        {errorMsg.map((msg, i) => {
                            return <div key={i}>{msg}</div>
                        })}
                    </Alert>) : (null)}
                </Grid>
                <Grid item xs={12}>
                    <MaterialTable
                        title="Blocked Words"
                        columns={tableContent.columns}
                        data={tableContent.data}
                        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
                        options={{
                            actionsColumnIndex: -1,
                            backgroundColor: "#E6E6E6",
                            headerStyle: {
                                backgroundColor: '#079b',
                                color: '#EEE'
                              },
                              rowStyle: rowData => ({
                                backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                              }),
                            
                        }}
                        
                        // options={{
                        //     actionsColumnIndex: -1,
                        //     // backgroundColor:"#424242",
                        //     // color:"#FFF",
                        //     // headerStyle: {
                        //     //     backgroundColor: '#424242',
                        //     //     color: '#FFF'
                        //     // }, rowStyle: {
                        //     //     backgroundColor: '#424242',
                        //     // },
                        //     // cellStyle: {
                        //     //     backgroundColor: '#424242',
                        //     //     color: '#FFF'
                        //     // },
                        //     // searchFieldStyle:{
                        //     //     color:"#FFF"
                        //     // },
                        //     // actionsCellStyle:{
                        //     //     color: "#FFF"
                        //     // },
                        //     // filterCellStyle:{
                        //     //     color:"#FFF"
                        //     // }
                        // }}
                        // style={{
                        //     backgroundColor: "#424242",
                        //     color: "#ffffff"
                        // }}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    handleRowAdd(newData, resolve)
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    handleRowDelete(oldData, resolve)
                                }),
                        }}
                    />
                </Grid>
            </Grid>
            <Container style={{marginBottom:"50px"}}>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </Container>
    );
}