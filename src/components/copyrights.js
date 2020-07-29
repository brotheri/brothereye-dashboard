import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
    return (
      <Typography variant="body2" style={{color: '#fff' }} align="center" margin="10px">
        {'Copyright © '}
        <Link  href="/Network Discovery" style={{ fontFamily: "DalekPinpoint", color: '#61FFF2' }}>
          Brother Eye
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }