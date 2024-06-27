import React, {useState} from 'react';
import './NavBar.css';

function NavBar({menuOpened, setMenuOpened}) {

    const toggleMenu = () => {
        const sidebar = document.getElementById("mySidebar");
        if (menuOpened) { // Close menu
            sidebar.style.display = "none";
            setMenuOpened(false);
        } else { // Open menu
            sidebar.className = "w3-sidebar w3-bar-block w3-collapse w3-card w3-animate-left sidebar spacerSidebar";
            sidebar.style.display = "block";
            setMenuOpened(true);
        }

    }

    return (
      <div>
          <div className="w3-container navbar-title">
              <button className="w3-button w3-padding-small w3-xlarge w3-hide-large" onClick={toggleMenu}>&#9776; </button>
              <span className="">Korus' Corner </span>
          </div>
          <div className="w3-sidebar w3-bar-block w3-collapse w3-card sidebar spacerSidebar" style={{width: '200px'}} id="mySidebar">
              <a href="/" className="w3-bar-item w3-button">Home</a>
              <a href="/about" className="w3-bar-item w3-button">About</a>
              <a href="/art-gallery" className="w3-bar-item w3-button">Art Gallery</a>
          </div>
          <div className="spacerMain"/>
      </div>
);

}

export default NavBar;