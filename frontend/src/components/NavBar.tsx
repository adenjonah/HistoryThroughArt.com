import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
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
      {/* Fixed Navbar — Nocturne: glassy aubergine bar, gilded hairline */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-[rgba(11,4,16,0.78)] backdrop-blur-md shadow-lg z-50 border-b border-[var(--border-gold)]">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo — gold medallion + serif wordmark */}
            <Link
              to="/"
              className="group flex items-center gap-3 transition-colors duration-200"
            >
              <span
                className="grid place-items-center w-[30px] h-[30px] rounded-full border-[1.5px] border-[var(--gold-color)] text-[var(--gold-color)] italic"
                style={{ fontFamily: "var(--font-display)", fontSize: 16 }}
                aria-hidden="true"
              >
                H
              </span>
              <span
                className="text-[var(--text-strong)] text-xl tracking-tight group-hover:text-[var(--gold-soft)] transition-colors duration-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                History Through Art
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `text-[13px] transition-all duration-200 pb-[3px] border-b-[1.5px] ${
                      isActive
                        ? "text-[var(--gold-soft)] border-[var(--gold-color)] opacity-100"
                        : "text-[var(--text-default)] border-transparent opacity-70 hover:opacity-100 hover:text-[var(--gold-soft)]"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpened((o) => !o); }}
              aria-label="Toggle menu"
              aria-expanded={menuOpened}
              className="lg:hidden p-2 rounded-lg text-[var(--text-default)] hover:text-[var(--gold-soft)] hover:bg-white/5 transition-all duration-200"
            >
              {menuOpened ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed top-[60px] left-0 right-0 bg-[rgba(11,4,16,0.96)] backdrop-blur-md border-b border-[var(--border-gold)] shadow-lg lg:hidden transition-all duration-300 ease-in-out z-40 ${
          menuOpened ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col py-2">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpened(false)}
              className={({ isActive }) =>
                `min-h-[44px] flex items-center px-4 py-3 text-[14px] transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--gold-soft)] bg-white/5 font-semibold border-l-2 border-[var(--gold-color)]"
                    : "text-[var(--text-default)] opacity-70 hover:opacity-100 hover:bg-white/5 border-l-2 border-transparent"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[60px]" />
    </div>
  );
}

export default NavBar;
