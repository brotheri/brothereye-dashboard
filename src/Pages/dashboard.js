import React, { useState, useEffect } from "react";
import AppBarWithDrawer from "../components/Vis page/material.appbar.drawer";
import BarRechart from "../components/bar.rechart"
import DoughnutRechart from "../components/doughnut.rechart"

import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Divider, Grid, Card } from "@material-ui/core";

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
    }
}));

export default function Dashboard() {
    const classes = useStyles();

    const [appTheme,setAppTheme] = useState(localStorage.getItem("appTheme"));

    return (
        <Container className={classes.root}>
            <AppBarWithDrawer />
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid container item xs={12} spacing={3}>
                    <React.Fragment>
                        <Grid item xs={4}>
                            <Card className={classes.card}>
                                <Typography className={classes.typography} align="left">
                                    Number of Users
                        </Typography>
                                <DoughnutRechart />
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card className={classes.card}>
                                <DoughnutRechart />
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card className={classes.card}>
                                <DoughnutRechart />
                            </Card>
                        </Grid>
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
                <Grid item xs={6}>
                    <Card className={classes.card}>
                        <BarRechart />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
