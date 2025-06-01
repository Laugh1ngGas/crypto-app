import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  WalletCards,
  BriefcaseBusiness,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Database,
  X,
} from "lucide-react";

const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      const savedState = localStorage.getItem("sidebarCollapsed");
      setCollapsed(savedState ? JSON.parse(savedState) : false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
    }
  }, [collapsed, isMobile]);
  

  const toggleSidebar = () => {
    if (!isMobile) setCollapsed(!collapsed);
  };

  const isActive = (path) => location.pathname === path;
  const isPathMatch = (prefix) => location.pathname.startsWith(prefix);

  const linkClasses = (path, isPrefix = false) =>
    `flex items-center cursor-pointer text-sm transition-colors duration-200 px-3 py-2 ${
      isMobile ? "justify-start space-x-2" : collapsed ? "justify-center" : "space-x-2"
    } ${
      (isPrefix ? isPathMatch(path) : isActive(path))
        ? "bg-neutral-800 text-orange-500 font-semibold rounded-lg"
        : "hover:text-orange-500 text-white"
    }`;

const sidebarContent = (
  <div
    className={`relative text-white rounded-2xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 ${
      isMobile
        ? "w-64 h-[100vh] bg-neutral-900"
        : collapsed
        ? "w-20 h-[80vh] bg-neutral-900"
        : "w-64 h-[80vh] bg-neutral-900"
    } flex-shrink-0`}
  >

      <div className="w-full">
        {isMobile ? (
          <div className="flex justify-end items-center mb-6">
            <button onClick={onCloseMobile} className="p-2">
              <X size={28} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center mb-6">
            <Link to="/" className={`flex items-center ${collapsed ? "ml-1" : "space-x-2"}`}>
              <img className="h-10 w-10 flex-shrink-0" src={logo} alt="logo" />
              {!collapsed && <span className="text-xl tracking-tight">Crypto App</span>}
            </Link>
          </div>
        )}

        <ul className="space-y-6 w-full">
          <li>
            <Link to="/dashboard/portfolio" className={linkClasses("/dashboard/portfolio")}>
              <WalletCards size={24} />
              {(isMobile || !collapsed) && <span>Portfolio</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/cryptocurrencies"
              className={linkClasses("/dashboard/cryptocurrencies", true)}
            >
              <Database size={24} />
              {(isMobile || !collapsed) && <span>Cryptocurrencies</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/favourite" className={linkClasses("/dashboard/favourite")}>
              <BriefcaseBusiness size={24} />
              {(isMobile || !collapsed) && <span>Favourite coins</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/trade" className={linkClasses("/dashboard/trade")}>
              <ArrowRightLeft size={24} />
              {(isMobile || !collapsed) && <span>Trade</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings" className={linkClasses("/dashboard/settings")}>
              <SettingsIcon size={24} />
              {(isMobile || !collapsed) && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </div>

      {isMobile && (
        <div className="flex items-center mt-6 justify-center">
          <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
          <span className="text-lg font-semibold">Crypto App</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile && (
        <>
          <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 ${
              mobileOpen ? "bg-black/50" : "bg-transparent pointer-events-none"
            }`}
            onClick={onCloseMobile}
          />
          <div
            className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent}
          </div>
        </>
      )}

      {!isMobile && (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={toggleSidebar}
            className={`absolute top-1/2 right-0 z-50 transform -translate-y-1/2 translate-x-1/2 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {sidebarContent}
        </div>
      )}
    </>
  );
};

export default Sidebar;
