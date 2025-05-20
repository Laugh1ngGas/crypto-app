import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, CircleUserRound, Search } from "lucide-react";
import logo from "../../assets/logo.png";
import { navItems } from "../../constants";
import { useAuth } from "../../contexts/authContext"; 
import { doSignOut } from "../../firebase/auth";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { userLoggedIn, currentUser } = useAuth();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <nav className="sticky top-0 z-50  backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
            </Link>
            <span className="text-xl tracking-tight">Crypto App</span>
          </div>

          <ul className="hidden lg:flex ml-14 space-x-12 relative">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="relative cursor-pointer select-none"
                onMouseEnter={() => item.submenu && setOpenMenu(item.label)}
                onMouseLeave={() => item.submenu && setOpenMenu(null)}
              >
                <div className="flex items-center gap-1 hover:text-orange-500">
                  <a href={item.href || "#"} className="h-16 flex items-center">{item.label}</a>
                  {item.submenu && (
                    openMenu === item.label
                      ? <ChevronUp size={14} />
                      : <ChevronDown size={14} />
                  )}
                </div>
                {item.submenu && openMenu === item.label && (
                  <ul className="absolute left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 rounded-b-md rounded-t-none shadow-lg z-10 min-w-[160px]">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={subItem.href}
                          className="block px-4 py-2 hover:bg-neutral-800 hover:text-orange-500"
                        >
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex justify-center space-x-8 items-center">
            <Search className="w-6 h-6 cursor-pointer text-white hover:text-orange-500" />
            {userLoggedIn ? (
              <div
                className="relative h-16 flex items-center"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <CircleUserRound className="w-6 h-6 cursor-pointer text-white hover:text-orange-500" />
                {profileMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full bg-neutral-900 border border-neutral-700 rounded-b-md rounded-t-none shadow-lg z-20 min-w-[200px]">
                    <ul>
                      <li className="px-4 py-2 border-b border-neutral-700 text-sm text-white/70">
                        {currentUser.displayName || "No nickname"}
                        <br />
                        <span className="text-xs text-neutral-400">{currentUser.email}</span>
                      </li>
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-neutral-800 hover:text-orange-500"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 hover:bg-neutral-800 hover:text-orange-500"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={doSignOut}
                          className="w-full text-left block px-4 py-2 hover:bg-neutral-800 hover:text-red-500"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="py-2 px-3 border rounded-md">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 mt-4">
              {userLoggedIn ? (
                <button onClick={doSignOut} className="py-2 px-3 border rounded-md">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/signin" className="py-2 px-3 border rounded-md">
                    Sign In
                  </Link>
                  <Link to="/signup" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
