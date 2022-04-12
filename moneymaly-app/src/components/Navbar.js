import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav className="nav-wrapper">
            <div className="container">
                <Link className="brand-logo center" to='/'>MoneyMaly</Link>
                <ul className='right'>
                    <li><Link to="/">Home</Link></li>
                    <li><NavLink to="/About">About</NavLink></li>
                    <li><NavLink to="/Contact">Contact</NavLink></li>
                    <li><NavLink to="/Login">Login</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;