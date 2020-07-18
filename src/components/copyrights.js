import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
    return (
      <Typography variant="body2" color="secondary" align="center" margin="10px">
        {'Copyright © '}
        <Link color="inherit" href="/Network Discovery">
          Brother Eye
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }