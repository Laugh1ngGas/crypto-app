import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import axios from "axios";
import { MoveUp, MoveDown, ArrowRightLeft } from "lucide-react";

const PortfolioBalance = () => {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [changeMap, setChangeMap] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);

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

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
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
        <div className="hidden md:flex gap-3">
          <button className="bg-neutral-800 text-white w-28 h-12 rounded-3xl hover:bg-neutral-700 transition">
            Send
          </button>
          <button className="bg-neutral-800 text-white w-28 h-12 rounded-3xl hover:bg-neutral-700 transition">
            Receive
          </button>
          <button className="bg-neutral-800 text-white w-28 h-12 rounded-3xl hover:bg-neutral-700 transition">
            Swap
          </button>
        </div>
      </div>
      <div className="flex justify-around md:hidden w-full mt-6">
        <div className="flex flex-col items-center cursor-pointer">
          <div className="bg-neutral-800 p-3 rounded-full hover:bg-neutral-700 transition">
            <MoveUp className="text-white" size={18} />
          </div>
          <span className="text-sm text-white mt-1">Send</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="bg-neutral-800 p-3 rounded-full hover:bg-neutral-700 transition">
            <MoveDown className="text-white" size={18} />
          </div>
          <span className="text-sm text-white mt-1">Receive</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="bg-neutral-800 p-3 rounded-full hover:bg-neutral-700 transition">
            <ArrowRightLeft className="text-white" size={18} />
          </div>
          <span className="text-sm text-white mt-1">Swap</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBalance;
