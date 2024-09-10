import './NavBar.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar({menuOpened, setMenuOpened}) {

    const navigate = useNavigate();

    const toggleMenu = (event) => {
        event.stopPropagation(); // Prevent the click from propagating to the document listener
        const sidebar = document.getElementById("mySidebar");
        if (menuOpened) { // Close menu
            sidebar.style.display = "none";
            setMenuOpened(false);
        } else { // Open menu
            if(window.innerWidth <= 992)
                sidebar.className = "w3-sidebar w3-bar-block w3-collapse w3-card w3-animate-left sidebar spacerSidebar";
            sidebar.style.display = "block";
            setMenuOpened(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById("mySidebar");
            if (menuOpened && sidebar && !sidebar.contains(event.target)) {
                sidebar.style.display = "none";
                setMenuOpened(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpened, setMenuOpened]);

    return (
      <div>
          <div className="w3-container navbar">
            <button className="w3-button navbar-menu-button" onClick={toggleMenu}>&#9776; </button>
            <span className="navbar-title" onClick={() => navigate('/')}>History Through Art</span>
          </div>
          <div className="w3-sidebar w3-bar-block w3-collapse w3-card sidebar spacerSidebar" style={{width: '200px'}} id="mySidebar">
              <a href="/" className="w3-bar-item w3-button">Home</a>
              <a href="/about" className="w3-bar-item w3-button">About</a>
              <a href="/artgallery" className="w3-bar-item w3-button">Art Gallery</a>
              <a href="/map" className="w3-bar-item w3-button">Map</a>
              <a href="/calendar" className="w3-bar-item w3-button">Calendar</a>
          </div>
          <div className="spacerMain"/>
      </div>
    );
}

export default NavBar;