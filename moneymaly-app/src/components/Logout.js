import React, { Component } from 'react'
import { Redirect } from 'react-router';

export default function Logout() {
    return (
        <div>
            { localStorage.clear()}
            <Redirect to="/" />
        </div>
    );
}; 