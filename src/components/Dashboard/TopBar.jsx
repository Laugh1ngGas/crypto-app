import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import UserWalletInfo from "../common/UserWalletInfo";
import { useEffect, useState } from "react";

const menuTitles = {
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/cryptocurrencies": "Cryptocurrencies",
  "/dashboard/favourite": "Favourite coins",
  "/dashboard/trade": "Trade",
  "/dashboard/settings": "Settings",
};

const TopBar = ({ user, onBurgerClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Перевірка, чи це сторінка монети (приклад: /dashboard/cryptocurrencies/:symbol)
  const isCoinPage = matchPath("/dashboard/cryptocurrencies/:symbol", location.pathname);

  // Заголовок для точного шляху або дефолтний
  const currentTitle = menuTitles[location.pathname] || "Crypto App";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex items-center justify-between rounded-2xl bg-neutral-900 text-white p-4 shadow-md w-full">
      <div className="flex items-center gap-2">
        {isMobile ? (
          // Бургер для мобільних
          <button
            onClick={onBurgerClick}
            className="p-2 rounded-lg hover:bg-neutral-800 transition"
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        ) : isCoinPage ? (
          // Кнопка "Назад" для сторінки монети
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-neutral-800 transition px-2 py-2 rounded-lg"
            aria-label="Go back"
          >
            <ArrowLeft size={26} />
          </button>
        ) : (
          // Заголовок для інших сторінок десктопом
          <h1 className="text-xl font-semibold">{currentTitle}</h1>
        )}
      </div>

      {/* На десктопі, якщо сторінка монети, відображаємо заголовок праворуч */}
      {!isMobile && isCoinPage && (
        <h1 className="text-xl font-semibold">{currentTitle}</h1>
      )}

      {/* Інформація про користувача */}
      <UserWalletInfo user={user} />
    </div>
  );
};

export default TopBar;
