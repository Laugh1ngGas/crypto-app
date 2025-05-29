import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  WalletCards,
  CircleDollarSign,
  BriefcaseBusiness,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation(); // <-- отримаємо поточний шлях
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  const toggleSidebar = () => {
    if (!isMobile) setCollapsed(!collapsed);
  };

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `flex items-center cursor-pointer text-sm transition-colors duration-200 px-3 py-2 ${
      collapsed ? "justify-center" : "space-x-2"
    } ${
      isActive(path)
        ? "bg-neutral-800 text-orange-400 font-semibold rounded-lg"
        : "hover:text-orange-400 text-white"
    }`;

  return (
    <div
      className={`group relative h-screen bg-neutral-900 text-white rounded-2xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20 items-center" : "w-64"
      }`}
    >
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Link to="/" className={`flex items-center ${collapsed ? "ml-1" : "space-x-2"}`}>
            <img className="h-10 w-10 flex-shrink-0" src={logo} alt="logo" />
            {!collapsed && <span className="text-xl tracking-tight">Crypto App</span>}
          </Link>
        </div>

        <ul className="space-y-6 w-full">
          <li>
            <Link to="/dashboard/portfolio" className={linkClasses("/dashboard/portfolio")}>
              <WalletCards size={24} />
              {!collapsed && <span>Portfolio</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/cryptocurrencies" className={linkClasses("/dashboard/cryptocurrencies")}>
              <CircleDollarSign size={24} />
              {!collapsed && <span>Cryptocurrencies</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/virtualportfolio" className={linkClasses("/dashboard/virtualportfolio")}>
              <BriefcaseBusiness size={24} />
              {!collapsed && <span>Create virtual portfolio</span>}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings" className={linkClasses("/dashboard/settings")}>
              <SettingsIcon size={24} />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </div>

      {!isMobile && (
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 group z-10">
          <button
            onClick={toggleSidebar}
            className="bg-neutral-800 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
