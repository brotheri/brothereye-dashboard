import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Copyright from "../components/copyrights"

import axios from 'axios';

import '../index.css'

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const handleUsernameChange = (event) =>  {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) =>  {
    setPassword(event.target.value);
  }

  const handleSubmitClick = (event) => {
    event.preventDefault();
    axios.post("http://193.227.38.177:3000/api/v1/auth/login", {email: username, password: password}).then(res => {
      localStorage.setItem('token',res.data.token);
      history.push('/Dashboard');
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <Container>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
              </Avatar>
              <Typography component="h1" variant="h5">Sign in</Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={username}
                  onChange={handleUsernameChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleSubmitClick}
                >
                  Sign In
          </Button>
              </form>
            </div>
          </Container>
        </div>
      </div>
      <Container>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Container>
  );
}