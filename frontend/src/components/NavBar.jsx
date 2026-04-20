import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/artgallery", label: "Art Gallery" },
  { to: "/flashcards", label: "Flashcards" },
  { to: "/map", label: "Map" },
  { to: "/calendar", label: "Calendar" },
  { to: "/tutorial", label: "How-To" },
  { to: "/about", label: "About Us" },
];

function NavBar({ menuOpened, setMenuOpened }) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpened && !event.target.closest(".navbar-container")) {
        setMenuOpened(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpened, setMenuOpened]);

  return (
    <div className="relative navbar-container">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[var(--accent-color)] shadow-lg z-50">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link
              to="/"
              className="text-[var(--text-color)] text-2xl font-bold hover:text-[var(--foreground-color)] transition-colors duration-200"
            >
              History Through Art
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-[var(--text-color)] hover:text-[var(--foreground-color)] transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpened((o) => !o); }}
              aria-label="Toggle menu"
              aria-expanded={menuOpened}
              className="lg:hidden p-2 rounded-lg text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-all duration-200"
            >
              {menuOpened ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed top-[60px] left-0 right-0 bg-[var(--accent-color)] shadow-lg lg:hidden transition-all duration-300 ease-in-out z-40 ${
          menuOpened ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col py-2">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpened(false)}
              className="px-4 py-2 text-[var(--text-color)] hover:text-[var(--foreground-color)] hover:bg-[var(--background-color)]/10 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[60px]" />
    </div>
  );
}

export default NavBar;
