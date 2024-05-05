import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for dropdown visibility

  const handleToggle = () => {
    setIsOpen(!isOpen); // Toggle dropdown visibility on click
  };

  return (
    <nav className="auction-navbar">
      <div className="navbar-container">
        <NavLink exact to="/" className="navbar-brand">
          SELLWELL
        </NavLink>
        <ul className="nav-items">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              Browse Auctions
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/sell" className="nav-link">
              Sell Something
            </NavLink>
          </li>
          <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" onClick={handleToggle}>
              My Account
            </button>
            {isOpen && ( // Conditionally render dropdown content
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/profile" className="dropdown-item">
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/watchlist" className="dropdown-item">
                    Watchlist
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/bids" className="dropdown-item">
                    My Bids
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/logout" className="dropdown-item">
                    Logout
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <form className="search-form" action="/search" method="get">
          <input type="text" name="q" placeholder="Search Auctions" />
          <button type="submit">Search</button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
