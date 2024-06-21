import React, {useState} from 'react';
import './NavBar.css';
import {Link} from "react-router-dom";

function NavBar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
      <div>
          <nav className="navbar ">
              <button className="navbar-menu-button" onClick={toggleMenu}>&#9776;</button>
              <div><Link to="/" className="navbar-title">PK Schoolbus</Link></div>
              <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
                  <a href="/" className="sidebar-item">Home</a>
                  <a href="/about" className="sidebar-item">About</a>
                  {/* Add new links here :D */}
              </div>
          </nav>
          <div className="spacer"></div>
      </div>
    ); }

    export default NavBar;