import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Fab, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import jwt_decode from "jwt-decode";

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

    const IsUserTokenValid = () => {
        try {
            var tokenExp = jwt_decode(localStorage.getItem('token')).exp;
            if (tokenExp < Date.now() / 1000) {
                return false;
            }
            return true;
        } catch (InvalidTokenError) {
            console.warn('Invalid User Token')
            return false;
        }
    };

    const renderUserNotLoggedIn = (
        <Container component="main" maxWidth="xs">
            <h4 className="center">Home</h4>
            <h5 className="center">you are not logged in !</h5>
            <h5 className="center">Please Login First <NavLink to="/Login">Login</NavLink></h5>
        </Container>
    );
   
    return (
        IsUserTokenValid() ? (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}><h1>MoneyMaly Dashboard</h1></Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}><h1>bllblblblblbllblbllb</h1></Paper>
                    </Grid>
                </Grid>
            </div>
        ) :
            (
                renderUserNotLoggedIn
            )
    );
}; 