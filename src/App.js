import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AdminsTable from './components/admins.table'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Box from '@material-ui/core/Box';

import SignIn from "./components/material.signin"
import Copyright from "./components/copyrights"
import Vis from './Pages/vis'
import NavBar from './components/navbar'
import Topology from './components/force.directed.graph'

import Container from '@material-ui/core/Container';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
            <Route exact path='/' component={SignIn} />
            <Route exact path="/SignIn" component={SignIn} />
            <Route exact path='/Vis' component={Topology} />
            <Route exact path='/admins' component={AdminsTable} />
        <Container>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </div>
    </Router>
  );
}

export default App;
