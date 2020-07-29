import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AdminsTable from './Pages/admins.table'
import { BrowserRouter as Router, Route } from "react-router-dom";

import SignIn from "./Pages/material.signin"
import Vis from './Pages/vis'
import Dashboard from './Pages/dashboard'
import Settings from './Pages/settings'
import GuardedRoute from "./components/guarded.route"
import DeviceMonitor from './Pages/device.monitor'

function App() {

  return (
    <Router>
      <div className="App">
        <Route exact path='/' component={SignIn} />
        <GuardedRoute exact path='/Network Discovery' component={Vis}/>
        <GuardedRoute exact path='/Dashboard' component={Dashboard} />
        <GuardedRoute exact path='/Admins' component={AdminsTable} />
        <GuardedRoute exact path='/Settings' component={Settings} />
        <GuardedRoute exact path='/Device Monitor' component={DeviceMonitor} />
      </div>
    </Router>
  );
}

export default App;
