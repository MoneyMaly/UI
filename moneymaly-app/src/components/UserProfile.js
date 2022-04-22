import { Redirect } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { validate_user_token, get_user_bank_accounts_list } from '../adapters/user_service_adapter';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'primary'
    }
}));
function render_user_logged_in(data) {
    if (data.full_name) {
        return (
            <div>
                <h1 className="center">User Profile</h1>
                <h2>Full Name: {data.full_name}</h2>
                <h2>Username: {data.username}</h2>
                <h2>Role: {data.role}</h2>
                <h2>Email: {data.email}</h2>
                <h2>Id: {data._id}</h2>
                <h2>Disabled: {(data.disabled).toString()}</h2>
            </div>
        )
    }
};

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
        console.log(bank_account_list.account_list)
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
    useEffect(() => {
            // console.log(validate_user_token(localStorage.getItem('username'), localStorage.getItem('token')));

        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            validate_user_token(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setUserProfileData(data);
            });
        get_user_bank_accounts_list(localStorage.getItem('username'), localStorage.getItem('token'))
            .then(data => {
                setUserBankAccountsList(prevState => ({ ...prevState, account_list: data }));
                console.log(data);
            });
    } 
}, []);
    
    return (
        localStorage.getItem('token') ? (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    {render_user_logged_in(userProfileData)}
                    {render_user_bank_accounts_list(userBankAccountsList)}
                </div>
            </Container>
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