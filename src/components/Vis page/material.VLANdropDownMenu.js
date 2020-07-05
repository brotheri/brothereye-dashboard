import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: "#424242"
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default function VLANDropDownMenu({ Data,VLAN }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedVLAN,setSelectedVLAN] = React.useState("");
  const anchorRef = React.useRef(null);
  const data = Data;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  function handleClose(nodeLabel) {
    return function(event) {
      setSelectedVLAN(nodeLabel);
      VLAN(nodeLabel);
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    }
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Paper className={classes.root}>
        <Button
          ref={anchorRef}
          variant="outlined"
          color="secondary"
          size="large"
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          style={{ flexGrow: "1" }}
        >
          select VLAN
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper style={{maxHeight: 300, overflow: 'auto'}}>
                <ClickAwayListener onClickAway={handleClose()}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" style={{ background: "#616771" }} onKeyDown={handleListKeyDown}>
                    {data.nodes.map((node, i) => (
                      <MenuItem key={i} onClick={handleClose(node.label)}>{node.label}</MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Paper>
    </div>
  );
}
