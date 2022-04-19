import axios from 'axios';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Home extends Component {
    state = {};

    componentDidMount() {
        if (localStorage.getItem("token") && localStorage.getItem('username')) {
            axios.get('http://192.116.98.107:8081/users', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                params: {
                    username: localStorage.getItem('username')
                }
            }).then(
                res => {
                    this.setState({ data: res.data });
                    console.log(this.state.data)
                },
                err => {
                    console.log(err);
                }
            );
        }
    }

    render() {
        if (this.state.data) {
            return (
                <div className="container">
                    <h4 className="center">Home</h4>
                    <h2>Hey: {this.state.data.full_name}</h2>
                </div>
            )
        }
        else {
            return (
                <div className="container">
                    <h4 className="center">Home</h4>
                    <h5 className="center">you are not logged in !</h5>
                    <h5 className="center">Please Login First <NavLink to="/Login">Login</NavLink></h5>

                </div>
            )
        }
    }
}

export default Home;