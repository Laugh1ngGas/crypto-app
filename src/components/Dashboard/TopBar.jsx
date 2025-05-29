import { useLocation } from "react-router-dom";
import UserWalletInfo from "../common/UserWalletInfo";

const menuTitles = {
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/cryptocurrencies": "Cryptocurrencies",
  "/dashboard/virtualportfolio": "Create virtual portfolio",
  "/dashboard/settings": "Settings",
};

const TopBar = ({ user }) => {
  const location = useLocation();
  const currentTitle = menuTitles[location.pathname] || "Crypto App";

  return (
    <div className="flex items-center justify-between rounded-2xl bg-neutral-900 text-white p-4 shadow-md w-full">
      <h1 className="text-xl font-semibold">{currentTitle}</h1>
      <UserWalletInfo user={user} />
    </div>
  );
};

export default TopBar;
