import { useState } from "react";
import {
  Copy,
  ChevronDown,
  ChevronRight,
  Settings as SettingsIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";  // <-- додано useNavigate
import { doSignOut } from "../../firebase/auth";

const shortenAddress = (address) => {
  if (!address) return "";
  return address.slice(0, 4) + "..." + address.slice(-4);
};

const UserWalletInfo = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "MW";

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(user.uid);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="group cursor-pointer w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center">
        <Link to="/dashboard/settings">
          <SettingsIcon className="w-5 h-5 text-neutral-400 group-hover:text-white" />
        </Link>
      </div>
      <div className="relative">
        <div
          className="group flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded-full text-white cursor-pointer"
          onClick={toggleMenu}
        >
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold">
            {initials}
          </div>
          <div className="flex flex-col leading-tight text-sm mr-1">
            <span className="font-semibold">Main Wallet</span>
            <div className="flex items-center text-xs text-neutral-400 gap-1">
              <span>{shortenAddress(user.uid)}</span>
              <Copy
                size={14}
                className="cursor-pointer hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
              />
            </div>
          </div>
          {menuOpen ? (
            <ChevronDown size={16} className="text-neutral-400 group-hover:text-white" />
          ) : (
            <ChevronRight size={16} className="text-neutral-400 group-hover:text-white" />
          )}
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-b-md rounded-t-none shadow-lg z-50 min-w-[200px]">
            <ul>
              <li className="px-4 py-2 border-b border-neutral-800 text-sm text-white/70">
                {user.displayName || "No nickname"}
                <br />
                <span className="text-xs text-neutral-400">{user.email}</span>
              </li>
              <li>
                <Link
                  to="/dashboard/portfolio"
                  className="block px-4 py-2 hover:bg-neutral-800 hover:text-orange-500"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/settings"
                  className="block px-4 py-2 hover:bg-neutral-800 hover:text-orange-500"
                >
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut} 
                  className="w-full text-left block px-4 py-2 hover:bg-neutral-800 hover:text-red-600"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWalletInfo;
