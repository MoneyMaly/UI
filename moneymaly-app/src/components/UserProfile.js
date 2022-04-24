import { Redirect } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import { get_user_bank_accounts_list } from '../adapters/bank_service_adapter';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.secondary.main
    }
}));

function bank_account_object(bank_account) {
    return (
        <ul>
            <li><h2>owner: {bank_account.owner}</h2></li>
            <li>account_number: {bank_account.account_number}</li>
            <li>ssn: {bank_account.ssn}</li>
            <li>username: {bank_account.username}</li>
        </ul>
    )
};

function render_user_bank_accounts_list(bank_account_list) {
    if (bank_account_list.account_list === []) {
        return (
            <div>
                Bank Account of Users
            </div>
        );
    }
    return (
        <div>
            {bank_account_list.account_list.map((account) =>
                bank_account_object(account))}
        </div>
    );
};

export default function UserProfile() {
    const [userProfileData, setUserProfileData] = useState({
        username: "",
        role: "",
        email: "",
        full_name: "",
        disabled: false,
        _id: ""
    });

    const [userBankAccountsList, setUserBankAccountsList] = useState({
        account_list: []
    });

    const classes = useStyles();
    function render_user_logged_in(data) {
        if (data.full_name) {
            return (
                <Paper className={classes.paper}>
                    <h1>Account Information</h1>
                    <h3>Full Name: {data.full_name}</h3>
                    <h3>Username: {data.username}</h3>
                    <h3>Role: {data.role}</h3>
                    <h3>Email: {data.email}</h3>
                    <h3>Id: {data._id}</h3>
                    <h3>Disabled: {(data.disabled).toString()}</h3>
                </Paper>
            )
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setUserProfileData(data);
            });
        get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setUserBankAccountsList(prevState => ({ ...prevState, account_list: data }));
            });
    } 
}, []);
    
    return (
        localStorage.getItem('token') ? (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}><h1>User Profile</h1></Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {render_user_logged_in(userProfileData)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            {render_user_bank_accounts_list(userBankAccountsList)}
                        </Paper>
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