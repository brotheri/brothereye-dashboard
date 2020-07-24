import React, { useState } from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
  const [appTheme,setAppTheme] = useState(localStorage.getItem("appTheme"));

    return (
      <Typography variant="body2" color="secondary" align="center" margin="10px">
        {'Copyright © '}
        <Link color="inherit" href="/Network Discovery" style={{ fontFamily: "DalekPinpoint" }}>
          Brother Eye
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }