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
          <div className="w3-container navbar">
            <button className="w3-button menu-button" onClick={toggleMenu}>&#9776; </button>
            <span className="navbar-title">Korus' Corner </span>
          </div>
          <div className="w3-sidebar w3-bar-block w3-collapse w3-card sidebar spacerSidebar" style={{width: '200px'}} id="mySidebar">
              <a href="/" className="w3-bar-item w3-button">Home</a>
              <a href="/about" className="w3-bar-item w3-button">About</a>
              <a href="/museum" className="w3-bar-item w3-button">Pieces</a>
              <a href="/map" className="w3-bar-item w3-button">Map</a>
          </div>
          <div className="spacerMain"/>
      </div>
);

}

export default NavBar;