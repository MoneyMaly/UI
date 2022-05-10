import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { get_user_data_with_token } from '../adapters/user_service_adapter';
import jwt_decode from "jwt-decode";

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

    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            get_user_data_with_token(localStorage.getItem('username'), localStorage.getItem("token")).then(data => {
                setState(prevState => ({ ...prevState, userData: data }));
            });
        }
    }, []);
   
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

        return (
            (state.userData !== null && IsUserTokenValid()) ?
            (
                <Container component="main" maxWidth="xs">
                    <h2 className="center">Home</h2>
                    <h3>Hello {state.userData.full_name}, Welcome to MoneyMaly!</h3>
                </Container>
            ) :
            (
                renderUserNotLoggedIn
            ));
}; 