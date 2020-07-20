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

    const vlanData = [{ "id": "1", "name": "default", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "2", "name": "uplink", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }, { "ip": "192.168.1.2", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.1.1", "mac": "4c:bc:48:31:b7:e1", "isLikelyStatic": false, "name": "192.168.1.1", "vendor": "Cisco Systems Inc.", "type": "sr-l7-bridge", "isSynonym": false, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "192.168.1.2", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.1.2", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "3", "name": "eun", "subnets": [] }, { "id": "5", "name": "Real", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }, { "ip": "193.227.38.1", "mask": "255.255.255.0", "devices": [{ "ip": "193.227.38.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": true, "name": "193.227.38.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": false, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "193.227.38.39", "mac": "90:1b:0e:33:8e:23", "isLikelyStatic": true, "name": "193.227.38.39", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.40", "mac": "90:1b:0e:33:88:89", "isLikelyStatic": true, "name": "193.227.38.40", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.56", "mac": "6c:0b:84:07:0d:e0", "isLikelyStatic": true, "name": "193.227.38.56", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.96", "mac": "00:19:99:a0:c3:ad", "isLikelyStatic": true, "name": "193.227.38.96", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.107", "mac": "6c:0b:84:07:0f:2b", "isLikelyStatic": true, "name": "193.227.38.107", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.142", "mac": "6c:0b:84:07:0f:76", "isLikelyStatic": true, "name": "193.227.38.142", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.175", "mac": "50:9a:4c:24:ce:13", "isLikelyStatic": true, "name": "193.227.38.175", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.177", "mac": "c0:3f:d5:fc:2d:b0", "isLikelyStatic": true, "name": "193.227.38.177", "vendor": "Elitegroup Computer Systems Ltd", "type": "host", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "193.227.38.191", "mac": "00:08:5d:75:6b:21", "isLikelyStatic": true, "name": "193.227.38.191", "vendor": "Mitel Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.205", "mac": "50:9a:4c:24:cc:e6", "isLikelyStatic": true, "name": "193.227.38.205", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.206", "mac": "90:1b:0e:33:ff:60", "isLikelyStatic": true, "name": "193.227.38.206", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.209", "mac": "6c:0b:84:07:32:43", "isLikelyStatic": true, "name": "193.227.38.209", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.228", "mac": "6c:0b:84:07:0e:49", "isLikelyStatic": true, "name": "193.227.38.228", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.229", "mac": "00:19:99:86:b9:44", "isLikelyStatic": true, "name": "193.227.38.229", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.238", "mac": "b8:ca:3a:83:26:b9", "isLikelyStatic": true, "name": "193.227.38.238", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.38.243", "mac": "00:19:99:8b:92:71", "isLikelyStatic": true, "name": "193.227.38.243", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "195.246.59.241", "mask": "255.255.255.240", "devices": [{ "ip": "195.246.59.241", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": true, "name": "195.246.59.241", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "195.246.59.243", "mac": "00:26:b9:75:51:1d", "isLikelyStatic": true, "name": "195.246.59.243", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "195.246.59.244", "mac": "bc:30:5b:dc:c9:1b", "isLikelyStatic": true, "name": "195.246.59.244", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": "public", "snmpEnabled": true }, { "ip": "195.246.59.246", "mac": "00:26:b9:7c:0a:aa", "isLikelyStatic": true, "name": "195.246.59.246", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }] }, { "id": "10", "name": "Management", "subnets": [{ "ip": "172.28.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "172.28.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.0.11", "mac": "00:0c:db:e1:92:f0", "isLikelyStatic": false, "name": "172.28.0.11", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.12", "mac": "00:0c:db:e5:b6:20", "isLikelyStatic": false, "name": "172.28.0.12", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.15", "mac": "00:0c:db:e1:8f:30", "isLikelyStatic": false, "name": "172.28.0.15", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.17", "mac": "00:0c:db:e5:af:20", "isLikelyStatic": false, "name": "172.28.0.17", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.19", "mac": "00:0c:db:e5:ad:20", "isLikelyStatic": false, "name": "172.28.0.19", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.0.21", "mac": "00:0c:db:e1:51:30", "isLikelyStatic": false, "name": "172.28.0.21", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.27", "mac": "00:12:f2:38:be:9d", "isLikelyStatic": false, "name": "172.28.0.27", "vendor": "Brocade Communications Systems LLC", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.0.101", "mac": "00:1b:d4:05:cd:7f", "isLikelyStatic": false, "name": "172.28.0.101", "vendor": "Cisco Systems Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.0.121", "mac": "00:12:f2:38:bd:fd", "isLikelyStatic": false, "name": "172.28.0.121", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.123", "mac": "00:0c:db:e5:b1:60", "isLikelyStatic": false, "name": "172.28.0.123", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.0.127", "mac": "00:12:f2:38:d0:dd", "isLikelyStatic": false, "name": "172.28.0.127", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.210", "mac": "00:12:f2:38:ee:73", "isLikelyStatic": false, "name": "172.28.0.210", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.215", "mac": "00:12:f2:38:c5:dd", "isLikelyStatic": false, "name": "172.28.0.215", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "public", "snmpEnabled": true }, { "ip": "172.28.0.223", "mac": "00:12:f2:38:d7:1d", "isLikelyStatic": false, "name": "172.28.0.223", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "admin123", "snmpEnabled": true }, { "ip": "172.28.0.227", "mac": "00:0c:db:e1:54:b0", "isLikelyStatic": false, "name": "172.28.0.227", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "public", "snmpEnabled": true }, { "ip": "172.28.0.254", "mac": "00:12:f2:38:d2:9d", "isLikelyStatic": false, "name": "172.28.0.254", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "11", "name": "Reyada_we_Physics", "subnets": [{ "ip": "172.28.8.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.8.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.8.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.8.2", "mac": "c4:a8:1d:da:94:8a", "isLikelyStatic": false, "name": "172.28.8.2", "vendor": "D-Link International", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.8.251", "mac": "00:18:4d:b5:a5:96", "isLikelyStatic": false, "name": "172.28.8.251", "vendor": "Netgear", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.13.174", "mac": "dc:90:88:8f:9a:13", "isLikelyStatic": false, "name": "172.28.13.174", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.13.245", "mac": "14:d1:1f:dd:a0:7c", "isLikelyStatic": false, "name": "172.28.13.245", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "12", "name": "3emara", "subnets": [{ "ip": "172.28.16.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.16.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.16.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.16.3", "mac": "bc:ad:28:9c:1f:e7", "isLikelyStatic": false, "name": "172.28.16.3", "vendor": "Hangzhou Hikvision Digital Technology Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.18.244", "mac": "bc:ad:28:9c:1f:d5", "isLikelyStatic": false, "name": "172.28.18.244", "vendor": "Hangzhou Hikvision Digital Technology Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.19.102", "mac": "c4:c5:63:31:9b:72", "isLikelyStatic": false, "name": "172.28.19.102", "vendor": "Tecno Mobile Limited", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.19.106", "mac": "ec:8c:9a:42:69:70", "isLikelyStatic": false, "name": "172.28.19.106", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.19.112", "mac": "fc:2d:5e:69:b3:ee", "isLikelyStatic": false, "name": "172.28.19.112", "vendor": "ZTE Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.19.114", "mac": "bc:91:b5:22:f7:68", "isLikelyStatic": false, "name": "172.28.19.114", "vendor": "Infinix mobility limited", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.21.136", "mac": "5c:f9:dd:6e:52:57", "isLikelyStatic": false, "name": "172.28.21.136", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "13", "name": "handaset_Elash3'al_el3ama", "subnets": [] }, { "id": "14", "name": "handaset_Elray_we_hydrolika", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "15", "name": "koa_mechanikiya", "subnets": [{ "ip": "172.28.40.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.40.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.40.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.40.4", "mac": "00:90:4c:91:00:01", "isLikelyStatic": false, "name": "172.28.40.4", "vendor": "Epigram Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.40.50", "mac": "00:00:74:dc:a7:99", "isLikelyStatic": false, "name": "172.28.40.50", "vendor": "Ricoh Company Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.40.191", "mac": "00:19:99:e8:a3:98", "isLikelyStatic": false, "name": "172.28.40.191", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.41.172", "mac": "44:39:c4:37:63:d0", "isLikelyStatic": false, "name": "172.28.41.172", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.43.222", "mac": "78:45:c4:0b:eb:77", "isLikelyStatic": false, "name": "172.28.43.222", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.45.73", "mac": "00:19:99:8b:92:36", "isLikelyStatic": false, "name": "172.28.45.73", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "16", "name": "Tasmem_mechaneky_we_Entag", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "17", "name": "Tayaran", "subnets": [{ "ip": "172.28.56.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.56.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.56.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.56.2", "mac": "c8:1f:66:df:ae:94", "isLikelyStatic": false, "name": "172.28.56.2", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.56.6", "mac": "f8:1a:67:41:18:2f", "isLikelyStatic": false, "name": "172.28.56.6", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.57.69", "mac": "6c:0b:84:07:0e:f7", "isLikelyStatic": false, "name": "172.28.57.69", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.57.184", "mac": "6c:0b:84:07:0f:4f", "isLikelyStatic": false, "name": "172.28.57.184", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.57.197", "mac": "e0:db:55:13:79:44", "isLikelyStatic": false, "name": "172.28.57.197", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.59.129", "mac": "20:16:d8:29:e6:92", "isLikelyStatic": false, "name": "172.28.59.129", "vendor": "Liteon Technology Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.59.233", "mac": "80:37:73:ad:98:a7", "isLikelyStatic": false, "name": "172.28.59.233", "vendor": "Netgear", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.59.249", "mac": "c8:1f:66:ed:22:62", "isLikelyStatic": false, "name": "172.28.59.249", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.59.250", "mac": "c8:1f:66:ed:22:61", "isLikelyStatic": false, "name": "172.28.59.250", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.1", "mac": "a4:2b:b0:d0:f5:1c", "isLikelyStatic": false, "name": "172.28.60.1", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.2", "mac": "a4:2b:b0:d1:33:60", "isLikelyStatic": false, "name": "172.28.60.2", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.3", "mac": "c4:e9:84:75:d1:a5", "isLikelyStatic": false, "name": "172.28.60.3", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.4", "mac": "a4:2b:b0:d0:f6:88", "isLikelyStatic": false, "name": "172.28.60.4", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.7", "mac": "ec:08:6b:8f:23:7a", "isLikelyStatic": false, "name": "172.28.60.7", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.34", "mac": "64:d8:14:5f:23:6e", "isLikelyStatic": false, "name": "172.28.60.34", "vendor": "Cisco Systems Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.51", "mac": "c8:1f:66:df:ae:93", "isLikelyStatic": false, "name": "172.28.60.51", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.53", "mac": "e0:db:55:13:85:78", "isLikelyStatic": false, "name": "172.28.60.53", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.60.119", "mac": "00:d8:61:5f:11:d6", "isLikelyStatic": false, "name": "172.28.60.119", "vendor": "Micro-Star INTL Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.61.22", "mac": "b4:75:0e:06:40:f6", "isLikelyStatic": false, "name": "172.28.61.22", "vendor": "Belkin International Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.61.101", "mac": "44:66:fc:bb:cd:85", "isLikelyStatic": false, "name": "172.28.61.101", "vendor": "Guangdong Oppo Mobile Telecommunications Corp Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.61.163", "mac": "aa:4a:d1:29:a4:4c", "isLikelyStatic": false, "name": "172.28.61.163", "vendor": "Unknown Device", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.61.164", "mac": "12:69:dd:07:ee:26", "isLikelyStatic": false, "name": "172.28.61.164", "vendor": "Unknown Device", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.61.165", "mac": "34:8b:75:63:45:0c", "isLikelyStatic": false, "name": "172.28.61.165", "vendor": "Lava International(H.K) Limited", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "18", "name": "Etesalat", "subnets": [{ "ip": "172.28.64.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.64.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.64.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.64.50", "mac": "b8:ac:6f:1f:ab:29", "isLikelyStatic": false, "name": "172.28.64.50", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.65.54", "mac": "00:18:39:52:4a:4a", "isLikelyStatic": false, "name": "172.28.65.54", "vendor": "Cisco-Linksys LLC", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "19", "name": "Elkoa_we_elalat_elkahrba2ia", "subnets": [{ "ip": "172.28.72.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.72.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.72.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.75.41", "mac": "94:0c:6d:c4:2a:71", "isLikelyStatic": false, "name": "172.28.75.41", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.75.247", "mac": "00:1c:c4:93:04:3c", "isLikelyStatic": false, "name": "172.28.75.247", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "20", "name": "Kemia", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "21", "name": "mnagem_petrol_flezat", "subnets": [{ "ip": "172.28.88.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.88.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.88.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.88.44", "mac": "b4:86:55:16:fb:b6", "isLikelyStatic": false, "name": "172.28.88.44", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.88.109", "mac": "98:90:96:b8:af:c9", "isLikelyStatic": false, "name": "172.28.88.109", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.88.110", "mac": "b4:2e:99:6d:75:6d", "isLikelyStatic": false, "name": "172.28.88.110", "vendor": "Giga-Byte Technology Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.88.161", "mac": "b4:2e:99:6d:75:e5", "isLikelyStatic": false, "name": "172.28.88.161", "vendor": "Giga-Byte Technology Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.88.210", "mac": "00:19:99:af:0b:cf", "isLikelyStatic": false, "name": "172.28.88.210", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.94.235", "mac": "98:90:96:bd:a2:eb", "isLikelyStatic": false, "name": "172.28.94.235", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.95.225", "mac": "80:ed:2c:16:b0:a1", "isLikelyStatic": false, "name": "172.28.95.225", "vendor": "Apple", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.95.226", "mac": "14:fe:b5:ad:29:12", "isLikelyStatic": false, "name": "172.28.95.226", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.95.230", "mac": "40:12:04:00:19:96", "isLikelyStatic": false, "name": "172.28.95.230", "vendor": "Unknown Device", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.95.253", "mac": "24:df:6a:13:71:d0", "isLikelyStatic": false, "name": "172.28.95.253", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "22", "name": "me2ani2a", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "23", "name": "7asebat", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "24", "name": "2nsha2ya", "subnets": [] }, { "id": "25", "name": "El2dara", "subnets": [{ "ip": "172.28.120.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.120.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.120.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.120.21", "mac": "ac:84:c6:00:ff:a6", "isLikelyStatic": false, "name": "172.28.120.21", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.120.139", "mac": "00:0c:29:00:a9:be", "isLikelyStatic": false, "name": "172.28.120.139", "vendor": "VMware Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.120.233", "mac": "98:90:96:bb:18:fa", "isLikelyStatic": false, "name": "172.28.120.233", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.122.237", "mac": "18:60:24:81:b1:46", "isLikelyStatic": false, "name": "172.28.122.237", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.122.250", "mac": "f0:9f:fc:b6:40:40", "isLikelyStatic": false, "name": "172.28.122.250", "vendor": "Sharp Corporation", "type": "printer", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.123.102", "mac": "f4:4d:30:97:f2:c1", "isLikelyStatic": false, "name": "172.28.123.102", "vendor": "Elitegroup Computer Systems Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.124.161", "mac": "74:da:88:22:6e:a8", "isLikelyStatic": false, "name": "172.28.124.161", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.124.230", "mac": "24:fb:65:aa:d8:0a", "isLikelyStatic": false, "name": "172.28.124.230", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.126.146", "mac": "b8:ac:6f:82:c8:4c", "isLikelyStatic": false, "name": "172.28.126.146", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.126.218", "mac": "bc:75:74:bd:b6:22", "isLikelyStatic": false, "name": "172.28.126.218", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.126.219", "mac": "bc:75:74:bd:b6:22", "isLikelyStatic": false, "name": "172.28.126.219", "vendor": "Huawei Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.127.105", "mac": "2c:44:fd:24:d1:7c", "isLikelyStatic": false, "name": "172.28.127.105", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.127.201", "mac": "00:23:ae:ae:48:88", "isLikelyStatic": false, "name": "172.28.127.201", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "26", "name": "tibia", "subnets": [{ "ip": "172.28.128.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.128.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.128.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.128.25", "mac": "94:10:3e:c7:19:8c", "isLikelyStatic": false, "name": "172.28.128.25", "vendor": "Belkin International Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.128.28", "mac": "3c:df:1e:a3:c0:c0", "isLikelyStatic": false, "name": "172.28.128.28", "vendor": "Cisco Systems Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.128.29", "mac": "58:bc:27:44:85:c0", "isLikelyStatic": false, "name": "172.28.128.29", "vendor": "Cisco Systems Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.128.30", "mac": "84:16:f9:59:2b:57", "isLikelyStatic": false, "name": "172.28.128.30", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.128.70", "mac": "74:46:a0:bf:78:b9", "isLikelyStatic": false, "name": "172.28.128.70", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.129.93", "mac": "74:46:a0:b7:3a:f0", "isLikelyStatic": false, "name": "172.28.129.93", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.129.200", "mac": "00:12:16:eb:5b:3c", "isLikelyStatic": false, "name": "172.28.129.200", "vendor": "ICP Internet Communication Payment AG", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.130.98", "mac": "c0:4a:00:2c:63:f8", "isLikelyStatic": false, "name": "172.28.130.98", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.130.144", "mac": "00:19:99:8b:7e:7b", "isLikelyStatic": false, "name": "172.28.130.144", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.130.251", "mac": "00:80:91:4e:a9:0c", "isLikelyStatic": false, "name": "172.28.130.251", "vendor": "Tokyo Electric Ltd", "type": "printer", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.130.252", "mac": "00:80:91:6c:b5:90", "isLikelyStatic": false, "name": "172.28.130.252", "vendor": "Tokyo Electric Ltd", "type": "printer", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.132.227", "mac": "14:58:d0:3b:ea:a0", "isLikelyStatic": false, "name": "172.28.132.227", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.134.137", "mac": "54:bf:64:83:2c:41", "isLikelyStatic": false, "name": "172.28.134.137", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.135.5", "mac": "d4:c9:ef:f3:0d:5a", "isLikelyStatic": false, "name": "172.28.135.5", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "27", "name": "Madani", "subnets": [{ "ip": "172.28.136.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.136.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.136.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.138.66", "mac": "00:1e:4f:bb:c3:02", "isLikelyStatic": false, "name": "172.28.138.66", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "28", "name": "ELKHRSANA", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "29", "name": "Bigiron-labs", "subnets": [] }, { "id": "30", "name": "LabS2", "subnets": [{ "ip": "172.28.144.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.144.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.144.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.144.40", "mac": "54:be:f7:0c:7f:77", "isLikelyStatic": false, "name": "172.28.144.40", "vendor": "Pegatron Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.144.84", "mac": "9c:d6:43:82:fb:15", "isLikelyStatic": false, "name": "172.28.144.84", "vendor": "D-Link International", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.144.85", "mac": "00:08:a3:8f:b9:40", "isLikelyStatic": false, "name": "172.28.144.85", "vendor": "Cisco Systems Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.144.86", "mac": "00:12:f2:38:c8:1d", "isLikelyStatic": false, "name": "172.28.144.86", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.144.87", "mac": "00:12:f2:38:d4:1d", "isLikelyStatic": false, "name": "172.28.144.87", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.144.88", "mac": "00:12:f2:38:be:7d", "isLikelyStatic": false, "name": "172.28.144.88", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "172.28.144.114", "mac": "54:be:f7:0c:7f:77", "isLikelyStatic": false, "name": "172.28.144.114", "vendor": "Pegatron Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.145.209", "mac": "00:7e:95:53:7c:f7", "isLikelyStatic": false, "name": "172.28.145.209", "vendor": "Cisco Systems Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "172.28.149.39", "mac": "a4:1f:72:77:18:c4", "isLikelyStatic": false, "name": "172.28.149.39", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "31", "name": "7asebat2", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "32", "name": "7asebat3", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "33", "name": "7asebat-wifi", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "34", "name": "7asebat-wifi2", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "35", "name": "doc-wifi", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "39", "name": "VLAN0039", "subnets": [] }, { "id": "40", "name": "193.227.9.x", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }, { "ip": "193.227.9.1", "mask": "255.255.255.0", "devices": [{ "ip": "193.227.9.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": true, "name": "193.227.9.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "193.227.9.10", "mac": "10:62:eb:34:3d:f8", "isLikelyStatic": true, "name": "193.227.9.10", "vendor": "D-Link International", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.9.11", "mac": "10:62:eb:34:3d:f8", "isLikelyStatic": true, "name": "193.227.9.11", "vendor": "D-Link International", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.9.12", "mac": "00:1e:c9:db:cd:dd", "isLikelyStatic": true, "name": "193.227.9.12", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.9.13", "mac": "00:0c:29:60:29:fb", "isLikelyStatic": true, "name": "193.227.9.13", "vendor": "VMware Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.9.14", "mac": "10:62:eb:34:3d:f8", "isLikelyStatic": true, "name": "193.227.9.14", "vendor": "D-Link International", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.9.51", "mac": "10:62:eb:34:3d:f8", "isLikelyStatic": true, "name": "193.227.9.51", "vendor": "D-Link International", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.9.52", "mac": "10:62:eb:34:3d:ff", "isLikelyStatic": true, "name": "193.227.9.52", "vendor": "D-Link International", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "193.227.9.200", "mac": "c0:3f:d5:fc:2b:5e", "isLikelyStatic": true, "name": "193.227.9.200", "vendor": "Elitegroup Computer Systems Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "193.227.10.1", "mask": "255.255.255.0", "devices": [{ "ip": "193.227.10.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": true, "name": "193.227.10.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "193.227.10.175", "mac": "90:1b:0e:33:88:44", "isLikelyStatic": true, "name": "193.227.10.175", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }] }, { "id": "41", "name": "VLAN0041", "subnets": [] }, { "id": "45", "name": "VLAN0045", "subnets": [] }, { "id": "120", "name": "Basma", "subnets": [{ "ip": "10.0.0.11", "mask": "255.0.0.0", "devices": [{ "ip": "10.0.0.1", "mac": "00:21:5e:57:6e:b0", "isLikelyStatic": false, "name": "10.0.0.1", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.3", "mac": "6c:0b:84:07:2b:72", "isLikelyStatic": false, "name": "10.0.0.3", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.4", "mac": "00:21:5e:5b:57:88", "isLikelyStatic": false, "name": "10.0.0.4", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.5", "mac": "00:0c:db:e1:88:30", "isLikelyStatic": false, "name": "10.0.0.5", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "10.0.0.6", "mac": "00:21:5e:5b:55:59", "isLikelyStatic": false, "name": "10.0.0.6", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.11", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "10.0.0.11", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "10.37.10.3", "mac": "6c:0b:84:07:2b:72", "isLikelyStatic": false, "name": "10.37.10.3", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.4", "mac": "00:1e:4f:f8:04:71", "isLikelyStatic": false, "name": "10.37.10.4", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.6", "mac": "00:1e:4f:f7:ee:24", "isLikelyStatic": false, "name": "10.37.10.6", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.10", "mac": "6c:0b:84:07:0b:9a", "isLikelyStatic": false, "name": "10.37.10.10", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.15", "mac": "6c:0b:84:07:0b:93", "isLikelyStatic": false, "name": "10.37.10.15", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.31", "mac": "00:0b:cd:23:45:5b", "isLikelyStatic": false, "name": "10.37.10.31", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.32", "mac": "00:21:5e:57:65:f4", "isLikelyStatic": false, "name": "10.37.10.32", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.33", "mac": "00:21:5e:57:65:f4", "isLikelyStatic": false, "name": "10.37.10.33", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.39", "mac": "00:15:5d:34:6e:1f", "isLikelyStatic": false, "name": "10.37.10.39", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.40", "mac": "d0:94:66:58:2d:1c", "isLikelyStatic": false, "name": "10.37.10.40", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.41", "mac": "00:15:5d:a2:f5:00", "isLikelyStatic": false, "name": "10.37.10.41", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.42", "mac": "00:1a:64:d5:12:22", "isLikelyStatic": false, "name": "10.37.10.42", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.52", "mac": "00:21:5e:57:6f:32", "isLikelyStatic": false, "name": "10.37.10.52", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.53", "mac": "00:1e:c9:db:b9:7e", "isLikelyStatic": false, "name": "10.37.10.53", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.54", "mac": "00:21:5e:57:6f:32", "isLikelyStatic": false, "name": "10.37.10.54", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.63", "mac": "00:22:19:7c:67:58", "isLikelyStatic": false, "name": "10.37.10.63", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.81", "mac": "00:15:5d:34:6e:02", "isLikelyStatic": false, "name": "10.37.10.81", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.82", "mac": "00:15:5d:34:6e:01", "isLikelyStatic": false, "name": "10.37.10.82", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.83", "mac": "00:15:5d:34:6e:04", "isLikelyStatic": false, "name": "10.37.10.83", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.85", "mac": "6c:0b:84:07:0e:f8", "isLikelyStatic": false, "name": "10.37.10.85", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.86", "mac": "00:15:5d:34:6e:07", "isLikelyStatic": false, "name": "10.37.10.86", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.87", "mac": "00:15:5d:34:6e:1a", "isLikelyStatic": false, "name": "10.37.10.87", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.121", "mac": "00:15:5d:a2:f5:01", "isLikelyStatic": false, "name": "10.37.10.121", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.126", "mac": "00:15:5d:a2:f5:02", "isLikelyStatic": false, "name": "10.37.10.126", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.161", "mac": "80:18:44:f0:28:94", "isLikelyStatic": false, "name": "10.37.10.161", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.165", "mac": "50:9a:4c:81:91:a1", "isLikelyStatic": false, "name": "10.37.10.165", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": "public", "snmpEnabled": true }, { "ip": "10.37.10.181", "mac": "00:1e:4f:f8:2d:a1", "isLikelyStatic": false, "name": "10.37.10.181", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.182", "mac": "00:1e:4f:f8:08:d5", "isLikelyStatic": false, "name": "10.37.10.182", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.197", "mac": "00:19:99:ab:1a:20", "isLikelyStatic": false, "name": "10.37.10.197", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.198", "mac": "00:0c:29:87:e4:f0", "isLikelyStatic": false, "name": "10.37.10.198", "vendor": "VMware Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.230", "mac": "00:21:5e:57:6e:b0", "isLikelyStatic": false, "name": "10.37.10.230", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.242", "mac": "00:15:5d:34:6e:1e", "isLikelyStatic": false, "name": "10.37.10.242", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.248", "mac": "00:15:5d:34:6e:20", "isLikelyStatic": false, "name": "10.37.10.248", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "123", "name": "hasebat-doc", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "124", "name": "hasebat-doc2", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "125", "name": "hasebat-doc3", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "126", "name": "hasebat-doc4", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "127", "name": "madani2", "subnets": [{ "ip": "172.28.168.1", "mask": "255.255.248.0", "devices": [{ "ip": "172.28.168.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "172.28.168.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "172.28.168.3", "mac": "a0:f3:c1:78:10:32", "isLikelyStatic": false, "name": "172.28.168.3", "vendor": "TP-Link Technologies Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "128", "name": "7asebat-wifi4", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "129", "name": "7asebat-wifi5", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "195", "name": "VLAN0195", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "211", "name": "Elreiadiate_wa_Elfezeka", "subnets": [] }, { "id": "212", "name": "3emara-machine", "subnets": [] }, { "id": "213", "name": "VLAN0213", "subnets": [] }, { "id": "214", "name": "handaset_Elray_we_hydrolika-2", "subnets": [] }, { "id": "215", "name": "koa_mechanikiya-2", "subnets": [] }, { "id": "216", "name": "Tasmem_mechaneky_we_Entag-2", "subnets": [] }, { "id": "217", "name": "Tayaran-2", "subnets": [] }, { "id": "218", "name": "Etesalat-2", "subnets": [] }, { "id": "219", "name": "Elkoa_we_elalat_elkahrba2ia-2", "subnets": [] }, { "id": "220", "name": "Kemia2", "subnets": [] }, { "id": "221", "name": "mnagem_petrol_flezat-2", "subnets": [] }, { "id": "222", "name": "Tebia-2", "subnets": [] }, { "id": "223", "name": "7asebat-2", "subnets": [] }, { "id": "224", "name": "2nsha2ya-2", "subnets": [] }, { "id": "225", "name": "El2dara-2", "subnets": [] }, { "id": "227", "name": "M3amel-1", "subnets": [] }, { "id": "229", "name": "El2dara_she2on_el_tlaba", "subnets": [{ "ip": "10.0.0.11", "mask": "255.0.0.0", "devices": [{ "ip": "10.0.0.1", "mac": "00:21:5e:57:6e:b0", "isLikelyStatic": false, "name": "10.0.0.1", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.3", "mac": "6c:0b:84:07:2b:72", "isLikelyStatic": false, "name": "10.0.0.3", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.4", "mac": "00:21:5e:5b:57:88", "isLikelyStatic": false, "name": "10.0.0.4", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.5", "mac": "00:0c:db:e1:88:30", "isLikelyStatic": false, "name": "10.0.0.5", "vendor": "Brocade Communications Systems LLC", "type": "l2-switch", "isSynonym": false, "snmpCommunity": "private", "snmpEnabled": true }, { "ip": "10.0.0.6", "mac": "00:21:5e:5b:55:59", "isLikelyStatic": false, "name": "10.0.0.6", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.0.0.11", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "10.0.0.11", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }, { "ip": "10.37.10.3", "mac": "6c:0b:84:07:2b:72", "isLikelyStatic": false, "name": "10.37.10.3", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.4", "mac": "00:1e:4f:f8:04:71", "isLikelyStatic": false, "name": "10.37.10.4", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.6", "mac": "00:1e:4f:f7:ee:24", "isLikelyStatic": false, "name": "10.37.10.6", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.10", "mac": "6c:0b:84:07:0b:9a", "isLikelyStatic": false, "name": "10.37.10.10", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.15", "mac": "6c:0b:84:07:0b:93", "isLikelyStatic": false, "name": "10.37.10.15", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.31", "mac": "00:0b:cd:23:45:5b", "isLikelyStatic": false, "name": "10.37.10.31", "vendor": "Hewlett-Packard Company", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.32", "mac": "00:21:5e:57:65:f4", "isLikelyStatic": false, "name": "10.37.10.32", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.33", "mac": "00:21:5e:57:65:f4", "isLikelyStatic": false, "name": "10.37.10.33", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.39", "mac": "00:15:5d:34:6e:1f", "isLikelyStatic": false, "name": "10.37.10.39", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.40", "mac": "d0:94:66:58:2d:1c", "isLikelyStatic": false, "name": "10.37.10.40", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.41", "mac": "00:15:5d:a2:f5:00", "isLikelyStatic": false, "name": "10.37.10.41", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.42", "mac": "00:1a:64:d5:12:22", "isLikelyStatic": false, "name": "10.37.10.42", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.52", "mac": "00:21:5e:57:6f:32", "isLikelyStatic": false, "name": "10.37.10.52", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.53", "mac": "00:1e:c9:db:b9:7e", "isLikelyStatic": false, "name": "10.37.10.53", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.54", "mac": "00:21:5e:57:6f:32", "isLikelyStatic": false, "name": "10.37.10.54", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.63", "mac": "00:22:19:7c:67:58", "isLikelyStatic": false, "name": "10.37.10.63", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.81", "mac": "00:15:5d:34:6e:02", "isLikelyStatic": false, "name": "10.37.10.81", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.82", "mac": "00:15:5d:34:6e:01", "isLikelyStatic": false, "name": "10.37.10.82", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.83", "mac": "00:15:5d:34:6e:04", "isLikelyStatic": false, "name": "10.37.10.83", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.85", "mac": "6c:0b:84:07:0e:f8", "isLikelyStatic": false, "name": "10.37.10.85", "vendor": "Universal Global Scientific Industrial Ltd", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.86", "mac": "00:15:5d:34:6e:07", "isLikelyStatic": false, "name": "10.37.10.86", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.87", "mac": "00:15:5d:34:6e:1a", "isLikelyStatic": false, "name": "10.37.10.87", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.121", "mac": "00:15:5d:a2:f5:01", "isLikelyStatic": false, "name": "10.37.10.121", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.126", "mac": "00:15:5d:a2:f5:02", "isLikelyStatic": false, "name": "10.37.10.126", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.161", "mac": "80:18:44:f0:28:94", "isLikelyStatic": false, "name": "10.37.10.161", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.165", "mac": "50:9a:4c:81:91:a1", "isLikelyStatic": false, "name": "10.37.10.165", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": "public", "snmpEnabled": true }, { "ip": "10.37.10.181", "mac": "00:1e:4f:f8:2d:a1", "isLikelyStatic": false, "name": "10.37.10.181", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.182", "mac": "00:1e:4f:f8:08:d5", "isLikelyStatic": false, "name": "10.37.10.182", "vendor": "Dell Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.197", "mac": "00:19:99:ab:1a:20", "isLikelyStatic": false, "name": "10.37.10.197", "vendor": "Fujitsu Technology Solutions GmbH", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.198", "mac": "00:0c:29:87:e4:f0", "isLikelyStatic": false, "name": "10.37.10.198", "vendor": "VMware Inc.", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.230", "mac": "00:21:5e:57:6e:b0", "isLikelyStatic": false, "name": "10.37.10.230", "vendor": "IBM Corp", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.242", "mac": "00:15:5d:34:6e:1e", "isLikelyStatic": false, "name": "10.37.10.242", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }, { "ip": "10.37.10.248", "mac": "00:15:5d:34:6e:20", "isLikelyStatic": false, "name": "10.37.10.248", "vendor": "Microsoft Corporation", "type": "host", "isSynonym": false, "snmpCommunity": false, "snmpEnabled": false }] }, { "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "255", "name": "VLAN0255", "subnets": [] }, { "id": "310", "name": "ElKobba", "subnets": [{ "ip": "192.168.0.1", "mask": "255.255.255.0", "devices": [{ "ip": "192.168.0.1", "mac": "d0:d0:fd:cc:15:ff", "isLikelyStatic": false, "name": "192.168.0.1", "vendor": "Cisco Systems Inc.", "type": "l3-switch-bridge", "isSynonym": true, "snmpCommunity": "cairo", "snmpEnabled": true }] }] }, { "id": "311", "name": "Hi_Tec_Center", "subnets": [] }, { "id": "1002", "name": "fddi-default", "subnets": [] }, { "id": "1003", "name": "token-ring-default", "subnets": [] }, { "id": "1004", "name": "fddinet-default", "subnets": [] }, { "id": "1005", "name": "trnet-default", "subnets": [] }];

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
    const [tableContent, setTableContent] = React.useState({
        columns: [
            { title: 'IP Address', field: 'ip' },
            { title: 'MAC Address', field: 'mac' },
            { title: 'Name', field: 'name' },
            { title: 'Vendor', field: 'vendor' },
            { title: 'Device Type', field: 'type' },
            { title: 'SNMP Community', field: 'snmpcommunity' },
            { title: 'SNMP Enabeled', field: 'snmpenabled' },
            { title: 'Monitor', field: 'monitored' },
        ],
        data: [],
    });
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
            // axios.get(`http://193.227.38.177:3000/api/v1/discover/vlans`, {
            //     headers: {
            //         Authorization: "Bearer " + localStorage.getItem("token")
            //     }
            // }).then((res) => {
            //     const data = res.data;
            //     if (data.value) {
            //         setTimeout(pollfn, 20 * 1000);
            //         return;
            //     }
            //     setTableContent({
            //         columns: [
            //             { title: 'Name', field: 'name' },
            //             { title: 'Subnet', field: 'subnets' }
            //         ],
            //         data: res.data.vlans,
            //     })
            //     console.log(data);
            //     setLoading(false);
            //     setTableTitle("VLANs");
            // });
            setTableContent({
                columns: [
                    { title: 'Name', field: 'name' },
                ],
                data: vlanData,
            })
            setHierarchicalVisData(CreateVisArray(vlanData));
            console.log(visGraphData);
            setLoading(false);
            setTableTitle("VLANs");
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
                                            <Grid item style={{ color: "red" }}>VLAN</Grid>
                                            <Grid item>
                                                <AntSwitch checked={switchMonitor.devices} onChange={handleChange} name="devices" />
                                            </Grid>
                                            <Grid item style={{ color: "red" }}>Devices</Grid>
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
                                            onRowClick={(event, selectedRow) => monitorDevice(selectedRow)}
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
                                                        <Card style={{backgroundColor:"#424242", color: "#FFF", marginBottom:"10px", padding:"10px"}}>
                                                            <Typography  variant={'h5'}>Select a VLAN to dispaly</Typography>
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
                                <Grid item xs={12} style={{marginBottom:"50px"}}>
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
