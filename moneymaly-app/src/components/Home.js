import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Container from '@material-ui/core/Container';

export default function Home() {
    const [state, setState] = useState({
        userData: null
    });

    const renderUserNotLoggedIn = (
        <Container component="main" maxWidth="xs">
            <h4 className="center">Home</h4>
            <h5 className="center">You are not logged in!</h5>
            <h5 className="center">Please Login First <NavLink to="/Login">Login</NavLink></h5>
        </Container>
    );
    const GetUserDataFromServer = () => {
        axios.get('http://192.116.98.107:8081/users', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            params: { username: localStorage.getItem('username') }
        }).then(
            res => {
                setState(prevState => ({ ...prevState, userData: res.data }));
            },
            err => {
                console.log(err);
            }
        );
    };
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            GetUserDataFromServer();
        }
    });
    return (
        state.userData ?
            (
                <Container component="main" maxWidth="xs">
                    <h4 className="center">Home</h4>
                    <h2>full_name: {state.userData.full_name}</h2>
                </Container>
            ) :
            (
                renderUserNotLoggedIn
            ));
}; 