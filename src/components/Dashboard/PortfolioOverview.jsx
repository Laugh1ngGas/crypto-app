import { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/list";
const COINGECKO_MARKETS = "https://api.coingecko.com/api/v3/coins/markets";
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/!ticker@arr";

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [user] = useAuthState(auth);
  const pricesRef = useRef({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "portfolio"));
        const coins = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPortfolio(coins);
      } catch (err) {
        setError("Error loading portfolio from Firestore.");
        console.error(err);
      }
    };

    fetchPortfolio();
  }, [user]);

  useEffect(() => {
    const fetchIcons = async () => {
      if (portfolio.length === 0) return;

      try {
        const listRes = await axios.get(COINGECKO_API);
        const idMap = {};
        listRes.data.forEach((coin) => {
          idMap[coin.symbol.toUpperCase()] = coin.id;
        });

        const ids = portfolio
          .map((coin) => idMap[coin.symbol.toUpperCase()])
          .filter(Boolean)
          .join(",");

        const marketRes = await axios.get(COINGECKO_MARKETS, {
          params: { vs_currency: "usd", ids },
        });

        const merged = portfolio.map((item) => {
          const cgId = idMap[item.symbol.toUpperCase()];
          const info = marketRes.data.find((c) => c.id === cgId);
          return {
            ...item,
            name: info?.name || item.symbol,
            image: info?.image || "",
            price: 0,
            change: 0,
          };
        });

        setCoinData(merged);
      } catch (err) {
        setError("Error fetching data from CoinGecko.");
        console.error(err);
      }
    };

    fetchIcons();
  }, [portfolio]);

  useEffect(() => {
    const ws = new WebSocket(BINANCE_WS_URL);

    ws.onmessage = (event) => {
      try {
        const updates = JSON.parse(event.data);
        updates.forEach((u) => {
          if (u.s.endsWith("USDT")) {
            const symbol = u.s.replace("USDT", "");
            pricesRef.current[symbol] = {
              price: parseFloat(u.c),
              change: parseFloat(u.P),
            };
          }
        });
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    };

    ws.onerror = (err) => {
      setError("Binance WebSocket connection error.");
      console.error(err);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoinData((prev) =>
        prev.map((coin) => {
          const update = pricesRef.current[coin.symbol.toUpperCase()];
          return update
            ? { ...coin, price: update.price, change: update.change }
            : coin;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      {/* {error && (
        <div className="bg-red-800 text-red-200 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )} */}
      <div className="rounded-xl overflow-hidden border border-neutral-800">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="text-left px-4 py-3 w-[200px]">Name</th>
              <th className="text-left px-4 py-3 w-[160px]">Price / 24H</th>
              <th className="text-left px-4 py-3 w-[120px]">Amount</th>
              <th className="text-left px-4 py-3 w-[160px]">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {coinData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-neutral-400">
                  Loading portfolio...
                </td>
              </tr>
            ) : (
              coinData.map((coin) => (
                <tr
                  key={coin.symbol}
                  className="border-t border-neutral-800 hover:bg-neutral-900 transition cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <Link
                      to={`/dashboard/cryptocurrencies/${coin.symbol.toUpperCase()}`}
                      className="flex items-center gap-3 overflow-hidden text-white"
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-medium truncate">{coin.name}</div>
                        <div className="text-xs text-neutral-400 uppercase truncate">
                          {coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      to={`/dashboard/cryptocurrencies/${coin.symbol.toUpperCase()}`}
                      className="text-white"
                    >
                      <div>${coin.price?.toFixed(4) || "0.0000"}</div>
                      <div
                        className={`text-sm font-semibold ${
                          coin.change > 0
                            ? "text-green-500"
                            : coin.change < 0
                            ? "text-red-500"
                            : "text-neutral-400"
                        }`}
                      >
                        {coin.change?.toFixed(2) || "0.00"}%
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4">{coin.amount}</td>
                  <td className="px-4 py-4">
                    ${(coin.price * coin.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default PortfolioOverview;
