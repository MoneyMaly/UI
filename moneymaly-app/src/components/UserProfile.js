import axios from 'axios';
import { Redirect } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';

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
    return (
        <div>
        <h1 className="center">User Profile</h1>
            <h2>full_name: {data.full_name}</h2>
            <h2>user_name: {data.username}</h2>
            <h2>role: {data.role}</h2>
            <h2>email: {data.email}</h2>
            <h2>id: {data._id}</h2>
            <h2>disabled: {(data.disabled).toString()}</h2>
        </div>
    )
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
    const classes = useStyles();
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            axios.get('http://192.116.98:8081/users', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                params: {
                    username: localStorage.getItem('username')
                }
            }).then(
                res => {
                    setUserProfileData(res.data);
                },
                err => {
                    console.log(err);
                }
            );
        }
    });
    return (
        localStorage.getItem('token') ? (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    {render_user_logged_in(userProfileData)}
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