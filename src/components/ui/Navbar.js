import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark ">
            
            <Link 
                className="navbar-brand text-warning" 
                to="/"
            >
                CayóAmarillo
            </Link>

            <div className="navbar-collapse">
                <div className="navbar-nav">

                    <NavLink 
                        activeClassName="active"
                        className="nav-item nav-link text-warning" 
                        exact
                        to="/marvel"
                    >
                        Hamburguesas
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item nav-link text-warning" 
                        exact
                        to="/dc"
                    >
                        Extras
                    </NavLink>
                    
                    <NavLink 
                        activeClassName="active"
                        className="nav-item nav-link text-warning" 
                        exact
                        to="/search"
                    >
                        Busca
                    </NavLink>
                </div>
            </div>

            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                    <NavLink 
                        activeClassName="active"
                        className="nav-item nav-link" 
                        exact
                        to="/login"
                    >
                        Logout
                    </NavLink>
                </ul>
            </div>
        </nav>
    )
}