import React from 'react';
import {
  DialogContent,
  Divider,
  Dialog,
  DialogActions,
  Button,
  Theme,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '600px',
    minHeight: '400px',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100vw - 32px)',
    },
    '& .inputSelect': {
      width: 'calc(100% - 35px)',
    },
  },
  button: {
    float: 'right',
  },
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px',
    },
  },
  headline: {
    marginBottom: '1.3em',
    fontSize: '1.1rem',
  },
  listSection: {
    margin: '2em 0 0.8em',
    '&:first-child': {
      margin: '1em 0 2em 0',
    },
  },
}));

export default function CaptureImageDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Capture Image</DialogTitle>
      <Divider />
      <DialogContent className={classes.headline}>** Captured image placeholder **</DialogContent>
      <Divider />
      <DialogActions>
        <Button color="primary" variant="contained" className={classes.button} onClick={onClose}>
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  );
}
