import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavBar({ menuOpened, setMenuOpened }) {
  const navigate = useNavigate();

  const toggleMenu = (event) => {
    event.stopPropagation();
    setMenuOpened(!menuOpened);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpened && !event.target.closest('.navbar-container')) {
        setMenuOpened(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpened, setMenuOpened]);

  return (
    <div className="relative">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[var(--accent-color)] shadow-lg z-50">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo/Title */}
            <div 
              onClick={() => navigate("/")}
              className="text-[var(--text-color)] text-2xl font-bold cursor-pointer hover:text-[var(--foreground-color)] transition-colors duration-200"
            >
              History Through Art
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="/" className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200">Home</a>
              <a href="/artgallery" className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200">Art Gallery</a>
              <a href="/flashcards" className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200">Flashcards</a>
              <a href="/map" className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200">Map</a>
              <a href="/calendar" className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200">Calendar</a>
              <a href="/tutorial" className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200">How-To</a>
              <a href="/about" className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200">About Us</a>
            </div>

            {/* Mobile Menu Button */}
            <div
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-all duration-200 cursor-pointer"
            >
              {menuOpened ? (
                <div className="text-2xl">✖</div>
              ) : (
                <div className="text-2xl">☰</div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed top-[60px] left-0 right-0 bg-[var(--accent-color)] shadow-lg lg:hidden transition-all duration-300 ease-in-out z-40 ${
          menuOpened ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex flex-col py-2">
          <a href="/" className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200">Home</a>
          <a href="/artgallery" className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200">Art Gallery</a>
          <a href="/flashcards" className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200">Flashcards</a>
          <a href="/map" className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200">Map</a>
          <a href="/calendar" className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200">Calendar</a>
          <a href="/tutorial" className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200">How-To</a>
          <a href="/about" className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200">About Us</a>
        </div>
      </div>

      {/* Spacer for content below navbar */}
      <div className="h-[60px]"></div>
    </div>
  );
}

export default NavBar;
