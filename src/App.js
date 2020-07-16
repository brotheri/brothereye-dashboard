import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AdminsTable from './components/admins.table'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Box from '@material-ui/core/Box';

import SignIn from "./components/material.signin"
import Copyright from "./components/copyrights"
import Vis from './Pages/vis'
import Dashboard from './Pages/dashboard'
import Settings from './Pages/settings'
import GuardedRoute from "./components/guarded.route"
import DeviceMonitor from './components/device.monitor'

import Container from '@material-ui/core/Container';
import Topology from './components/force.directed.graph';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' component={SignIn} />
        <GuardedRoute exact path='/Network Visualization' component={Vis}/>
        <GuardedRoute exact path='/Dashboard' component={Dashboard} />
        <GuardedRoute exact path='/Admins' component={AdminsTable} />
        <Route exact path='/Settings' component={Settings} />
        <Route exact path='/Device Monitor' component={DeviceMonitor} />
      </div>
    </Router>
  );
}

export default App;
