import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

class NavBar extends Component {
    render() {
        return (
            <nav className="nav-wrapper" >
                <div className="container">
                    <Link className="brand-logo center" to='/'>MoneyMaly</Link>
                    <ul className='left'>
                        <li><Link to="/">Home</Link></li>
                        <li><NavLink to="/About">About</NavLink></li>
                        <li><NavLink to="/Contact">Contact Us</NavLink></li>

                    </ul>
                    <ul className='right'>
                        <li><NavLink to="/Logout">Logout</NavLink></li>
                        <li><NavLink to="/Login">Login</NavLink></li>
                        <li><NavLink to="/Signup">Sign Up</NavLink></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default NavBar;