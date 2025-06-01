import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import axios from "axios";

const PortfolioBalance = () => {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [changeMap, setChangeMap] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);

  // 1. Завантаження портфеля з Firestore
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!currentUser) return;

      const userPortfolioRef = collection(db, "users", currentUser.uid, "portfolio");
      const snapshot = await getDocs(userPortfolioRef);
      const data = snapshot.docs.map((doc) => doc.data());

      setPortfolio(data);
    };

    fetchPortfolio();
  }, [currentUser]);

  // 2. Періодичне оновлення цін через Binance API
  useEffect(() => {
    if (portfolio.length === 0) return;

    const interval = setInterval(async () => {
      const symbols = portfolio.map((coin) => `${coin.symbol.toUpperCase()}USDT`);

      try {
        const response = await axios.get("https://api.binance.com/api/v3/ticker/24hr");
        const prices = response.data;

        const newPriceMap = {};
        const newChangeMap = {};

        symbols.forEach((symbol) => {
          const data = prices.find((item) => item.symbol === symbol);
          if (data) {
            const sym = symbol.replace("USDT", "");
            newPriceMap[sym] = parseFloat(data.lastPrice);
            newChangeMap[sym] = parseFloat(data.priceChangePercent);
          }
        });

        setPriceMap(newPriceMap);
        setChangeMap(newChangeMap);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [portfolio]);

  // 3. Розрахунок загальної вартості та зміни
  useEffect(() => {
    if (portfolio.length === 0 || Object.keys(priceMap).length === 0) return;

    let total = 0;
    let weightedChangeSum = 0;

    portfolio.forEach((coin) => {
      const symbol = coin.symbol.toUpperCase();
      const amount = parseFloat(coin.amount);
      const price = priceMap[symbol] || 0;
      const changePercent = changeMap[symbol] || 0;

      const value = amount * price;
      total += value;

      weightedChangeSum += value * changePercent;
    });

    setTotalValue(total);
    setTotalChange(weightedChangeSum / total || 0);
  }, [priceMap, changeMap, portfolio]);

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 flex items-center justify-between text-white">
      <div>
        <div className="text-xs text-neutral-400 font-medium uppercase tracking-widest mb-1">
          Total Value
        </div>
        <div className="flex items-end space-x-2">
          <div className="text-3xl font-semibold">${totalValue.toFixed(2)}</div>
          <div
            className={`text-sm font-medium ${
              totalChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {totalChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button className="bg-neutral-800 hover:bg-gradient-to-r hover:from-neutral-700 hover:to-neutral-800 text-white font-semibold w-28 h-12 rounded-full text-sm">
          Send
        </button>
        <button className="bg-neutral-800 hover:bg-gradient-to-r hover:from-neutral-700 hover:to-neutral-800 text-white font-semibold w-28 h-12 rounded-full text-sm">
          Receive
        </button>
        <button className="bg-gradient-to-r from-orange-500 to-orange-800 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-900 text-white font-semibold w-28 h-12 rounded-full text-sm">
          Swap
        </button>
      </div>
    </div>
  );
};

export default PortfolioBalance;
