import { Redirect } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Button, Container, Fab, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import { get_user_bank_accounts_list, delete_user_bank_accounts_list, add_user_bank_accounts_list } from '../adapters/bank_service_adapter';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.info.main,
        variant: 'outlined'
    }
}));

export default function UserDashboard() {
    const [userProfileData, setUserProfileData] = useState({
        username: ""
    });

    const classes = useStyles();

    return (
        localStorage.getItem('token') ? (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}><h1>Dashboard</h1></Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}><h1>bllblblblblbllblbllb</h1></Paper>
                    </Grid>
                </Grid>
            </div>
        ) :
            (
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            You Are Not Logged In ...
                       </Typography>
                        <Redirect to="/Login" />
                    </div>
                </Container>
            )
    );
}; 