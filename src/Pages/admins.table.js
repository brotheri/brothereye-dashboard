import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';

import Grid from '@material-ui/core/Grid'
import AppBarWithDrawer from "../components/material.appbar.drawer";
import Container from "@material-ui/core/Container";
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';

import Box from '@material-ui/core/Box';
import Copyright from "../components/copyrights"

import { makeStyles } from "@material-ui/core/styles";

// Responsible for all Icons that would be needed in the table
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
// applying style for the table
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: "xl",
    marginTop: "15px",
  },
  gridContainer: {
    marginTop: "100px"
  }
}));
// Creation of client using The base address that would be holding the server
const api = axios.create({
  baseURL: "http://193.227.38.177:3000"
})
// Retrieving the user token stored in the local storage
var token = localStorage.getItem("token");
// validate that input is in email form
function validateEmail(email) {
  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

function AdminsTable() {
  const classes = useStyles(); 

  const [appTheme,setAppTheme] = useState(localStorage.getItem("appTheme"));
// defining the columns of the table
  var columns = [
    { title: "Id", field: "_id", hidden: true, editable: 'never' },
    { title: "V", field: "__v", hidden: true, editable: 'never' },
    { title: "Name", field: "full_name" },
    { title: "Role", field: "role", editPlaceholder: "Password", },
    { title: "Email", field: "email" },
    { title: "Created At", field: "createdAt", editable: 'never' },
    { title: "Updated At", field: "updatedAt", editable: 'never' },
  ]
  const [data, setData] = useState([]); //table data management
  const [selectedRow, setSelectedRow] = useState(null); // selected row management

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

// make the api call to retrieve data from the server to fill the table
  useEffect(() => {
    api.get(`/api/v1/settings/admin`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
      .then(res => {
        console.log(res);
        setData(res.data.admins);
      })
      .catch((error) => {
        console.log(error)
      });
  }, [])

// function to handle adding a new admin and validation
  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []
    if (newData.full_name === undefined) {
      errorList.push("Please enter first name")
    }
    if (newData.role === undefined) {
      errorList.push("Please enter last name")
    }
    if (newData.email === undefined || validateEmail(newData.email) === false) {
      errorList.push("Please enter a valid email")
    }

    let addedData = {};
    addedData.full_name = newData.full_name;
    addedData.email = newData.email;
    addedData.password = newData.role;

    if (errorList.length < 1) { //no error
      api.post("/api/v1/settings/admin", addedData, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
        .then(res => {

          api.get(`/api/v1/settings/admin`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
            .then(res => {
              console.log(res);
              setData(res.data.admins);
            })
            .catch((error) => {
              console.log(error)
            });
          /* let dataToAdd = [...data];
          dataToAdd.push(res.admin);
          setData(dataToAdd); */
          resolve()
          setErrorMessages([])
          setIserror(false)
        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }


  }
// function to handle deleting existing admin
  const handleRowDelete = (oldData, resolve) => {
    api.delete("/api/v1/settings/admin/" + oldData._id, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
      .then(res => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  return (
    <Container className={classes.root}>
      <AppBarWithDrawer />
      <div style={{ marginTop: '100px' }} className="AdminsTable">

        <Grid container spacing={5}>
          <Grid item xs={12}>
            <div>
              {iserror &&
                <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                    return <div key={i}>{msg}</div>
                  })}
                </Alert>
              }
            </div>
            <MaterialTable
              title="Admins"
              columns={columns}
              data={data}

              icons={tableIcons}
              onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
              options={{
                actionsColumnIndex: -1,
                sorting: true,
                rowStyle: rowData => ({
                  backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                }),
                headerStyle: {
                  backgroundColor: '#079b',
                  color: '#EEE'
                },
              }}

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
      </div>
      <Container style={{ marginBottom: "50px" }}>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Container>
  );
}

export default AdminsTable;