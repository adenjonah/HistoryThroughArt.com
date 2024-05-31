import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <button className="navbar-menu-button">&#9776;</button> {/* Unicode for hamburger menu icon */}
      <div className="navbar-title">Korus' Corner</div>
    </nav>
  );
}

export default NavBar;