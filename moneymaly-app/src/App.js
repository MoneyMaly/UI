import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                <Navbar />
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route path='/About' component={About} />
                        <Route path='/Contact' component={Contact} />
                        <Route path='/Login' component={Login} />
                        <Route path='/Logout' component={Logout} />
                        <Route path='/Signup' component={Signup} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}