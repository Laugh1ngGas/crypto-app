import { useLocation, useNavigate, useParams, matchPath } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserWalletInfo from "../common/UserWalletInfo";

const menuTitles = {
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/cryptocurrencies": "Cryptocurrencies",
  "/dashboard/virtualportfolio": "Virtual portfolio",
  "/dashboard/settings": "Settings",
  "/dashboard/trade": "Trade",
};

const TopBar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isCoinPage = matchPath("/dashboard/cryptocurrencies/:symbol", location.pathname);

  const currentTitle = menuTitles[location.pathname] || "Crypto App";

  return (
    <div className="flex items-center justify-between rounded-2xl bg-neutral-900 text-white p-4 shadow-md w-full">
      {isCoinPage ? (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:bg-neutral-800 transition px-2 py-2 rounded-lg"
        >
          <ArrowLeft size={26} />
        </button>
      ) : (
        <h1 className="text-xl font-semibold">{currentTitle}</h1>
      )}
      <UserWalletInfo user={user} />
    </div>
  );
};

export default TopBar;
