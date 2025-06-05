import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import logo from "../../assets/logo.png";
import { navItems } from "../../constants";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { doSignOut } from "../../firebase/auth";
import SignInSignUpToggle from "../Auth/SignButtonAnimation";
import UserWalletInfo from "./UserWalletInfo";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const { userLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
    setOpenMenu(null);
  };

  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleSignOut = () => {
    doSignOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-10 w-10" src={logo} alt="logo" />
              <span className="text-xl tracking-tight">Crypto App</span>
            </Link>
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
                  <ul className="absolute left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 rounded-b-md shadow-lg z-10 min-w-[160px]">
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
            {userLoggedIn ? (
              <UserWalletInfo user={currentUser} />
            ) : (
              <SignInSignUpToggle />
            )}
          </div>
          <div className="lg:hidden flex">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="lg:hidden flex flex-col bg-neutral-900 p-6 rounded-md space-y-4 z-50">
            {userLoggedIn && (
              <div className="border-b border-neutral-700 pb-4 flex justify-center">
                <UserWalletInfo user={currentUser} />
              </div>
            )}

            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <li key={index} className="text-white">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => item.submenu ? toggleMenu(item.label) : setMobileDrawerOpen(false)}
                  >
                    <a href={item.href || "#"}>{item.label}</a>
                    {item.submenu && (
                      openMenu === item.label
                        ? <ChevronUp size={18} />
                        : <ChevronDown size={18} />
                    )}
                  </div>
                  {item.submenu && openMenu === item.label && (
                    <ul className="pl-4 mt-2 space-y-2 text-sm text-neutral-300">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a href={subItem.href} className="hover:text-orange-500">
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-center space-y-3">
              {userLoggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-2 px-4 border rounded-md hover:bg-neutral-800 hover:text-red-600"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/signin" className="w-full text-center py-2 px-4 border rounded-md">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-4 rounded-md text-white"
                  >
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
