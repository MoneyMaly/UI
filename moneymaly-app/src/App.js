import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import UserProfile from './components/UserProfile';
import UserDashboard from './components/UserDashboard';
import BussinessUserDashboard from './components/BusinessUserDashboard';

function Copyright() {
    const style = {
        backgroundColor: "#209cee38",
        textAlign: "center",
        paddingTop: "15px",
        paddingBottom: "15px",      
        position: "static",
        left: "0px",
        bottom: "0px",
        height: "2%",
        width: "100%"
    };
    return (
        <div style={style}>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href='/About'>MoneyMaly Developer Team</Link>
                {' '}{new Date().getFullYear()}{'.'}
            </Typography>
        </div>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <Navbar />
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/About' component={About} />
                    <Route path='/Contact' component={Contact} />
                    <Route path='/Login' component={Login} />
                    <Route path='/Logout' component={Logout} />
                    <Route path='/Signup' component={Signup} />
                    <Route path='/UserProfile' component={UserProfile} />
                    <Route path='/UserDashboard' component={UserDashboard} />
                    <Route path='/BusinessUserDashboard' component={BusinessUserDashboard} />
                </Switch>
                <Copyright />
            </div>
        </BrowserRouter>
    );
};