import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Box from '@material-ui/core/Box';

import SignIn from "./components/material.signin"
import Copyright from "./components/copyrights"
import Vis from './Pages/vis'
import Dashboard from './Pages/dashboard'

import Container from '@material-ui/core/Container';
import Topology from './components/force.directed.graph';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' component={SignIn} />
        <Route exact path='/Network Visualization' component={Vis} />
        <Route exact path='/Dashboard' component={Dashboard} />
      </div>
    </Router>
  );
}

export default App;
