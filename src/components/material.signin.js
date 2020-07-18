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

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';

import Alert from '@material-ui/lab/Alert';

import Box from '@material-ui/core/Box';
import Copyright from "../components/copyrights"


import axios from 'axios';

import '../index.css'

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(25),
    height: theme.spacing(25),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(10, 0, 2),
  },
  dialogTitle: {
    background: '#424242',
    paddingTop: "25px",
    color: 'white',
    alignContent: "center"
  },
  dialogContent: {
    background: '#424242',
    paddingBottom: "25px",
    paddingLeft: "25px",
    paddingRight: "25px",
    color: 'white'
  }
}));

export default function SignIn() {

  const classes = useStyles();
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const [usernameEmpty, setUsernameError] = useState(false);
  const [passwordEmpty, setPasswordError] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmitClick = (event) => {
    setError(false);
    event.preventDefault();
    if (!username) {
      setUsernameError(true);
      return;
    }
    setUsernameError(false);
    if (!password) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
    setLoggingIn(true);
    axios.post("http://193.227.38.177:3000/api/v1/auth/login", { email: username, password: password }).then(res => {

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('auth', true);
      localStorage.setItem('createdAt', new Date(res.data.user.createdAt).toDateString());
      localStorage.setItem('email',res.data.user.email);
      localStorage.setItem('full_name',res.data.user.full_name);
      localStorage.setItem('lastLoginAttempt',new Date(res.data.user.lastLoginAttempt).toLocaleString());
      localStorage.setItem('role',res.data.user.role);
      history.push('/Dashboard');
    }).catch(err => {
      console.dir(err);
      setLoggingIn(false);
      setError(true);
      if (err.response === undefined) {
        setErrorMsg(["Login faild, Server error"]);
      }
      else {
        setErrorMsg(["Login faild, " + err.response.data.error]);
      }

    });
  }

  useEffect(() => { }, [loggingIn]);

  return (
    <Container>
      {loggingIn ? (
        <Dialog  open={loggingIn} fullWidth={true} maxWidth={"sm"}>
          <DialogTitle className={classes.dialogTitle} ><Typography align={"center"} >Logging In, Please wait !!!</Typography></DialogTitle>
          <DialogContent className={classes.dialogContent}>
            
            <LinearProgress />
          </DialogContent>
        </Dialog>
      ) : (null)}
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            {isError ? (<Alert severity="error">
              {errorMsg.map((msg, i) => {
                return <div key={i}>{msg}</div>
              })}
            </Alert>) : (null)}
            <div className={classes.paper}>
              <Avatar className={classes.avatar} src="Icons/final_logo.png" >
              </Avatar>
              <Typography component="h1" variant="h5">Sign in</Typography>
              <form className={classes.form} noValidate>
                <TextField
                  error={usernameEmpty}
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
                  helperText={usernameEmpty ? "Email is required" : null}
                />
                <TextField
                  error={passwordEmpty}
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
                  helperText={passwordEmpty ? "Password is required" : null}
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