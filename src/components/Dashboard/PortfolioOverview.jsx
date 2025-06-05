import { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/list";
const COINGECKO_MARKETS = "https://api.coingecko.com/api/v3/coins/markets";
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/!ticker@arr";

const ITEMS_PER_PAGE = 8;

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [user] = useAuthState(auth);
  const pricesRef = useRef({});
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "portfolio"));
        const coins = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPortfolio(coins);
        setPage(0);
      } catch (err) {
        setError("Error loading portfolio from Firestore.");
        console.error(err);
      }
    };

    fetchPortfolio();
  }, [user]);

  useEffect(() => {
    const fetchIcons = async () => {
      if (portfolio.length === 0) {
        setCoinData([]);
        return;
      }

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

  const totalPages = Math.ceil(coinData.length / ITEMS_PER_PAGE);
  const paginatedData = coinData.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <div className="w-full mx-auto pt-4 text-white">       
      {/* {error && (
        <div className="bg-red-800 text-red-200 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )} */}
      <div className="hidden md:block rounded-xl overflow-hidden border border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm min-w-[600px]">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="text-left px-4 py-3 w-[200px]">Name</th>
                <th className="text-left px-4 py-3 w-[160px]">Price / 24H</th>
                <th className="text-left px-4 py-3 w-[180px]">Balance</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-neutral-400">
                    Loading portfolio...
                  </td>
                </tr>
              ) : (
                paginatedData.map((coin) => (
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
                        <div>${coin.price?.toFixed(4) || "0.00"}</div>
                        <div
                          className={`text-sm font-semibold ${
                            coin.change > 0
                              ? "text-green-500"
                              : coin.change < 0
                              ? "text-red-500"
                              : "text-neutral-400"
                          }`}
                        >
                          {coin.change?.toFixed(2)}%
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium truncate">
                        ${((coin.amount || 0) * (coin.price || 0)).toFixed(2)}
                      </div>
                      <div className="text-sm text-neutral-400 truncate">
                        {coin.amount} {coin.symbol.toUpperCase()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {paginatedData.length === 0 ? (
          <div className="text-center py-6 text-neutral-400">Loading portfolio...</div>
        ) : (
          paginatedData.map((coin) => (
            <Link
              to={`/dashboard/cryptocurrencies/${coin.symbol.toUpperCase()}`}
              key={coin.symbol}
              className="block bg-neutral-900 rounded-xl p-4 hover:bg-neutral-800 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate">{coin.name}</div>
                  <div className="text-xs text-neutral-400 uppercase truncate">
                    {coin.symbol.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-between">
                <div>
                  <div className="text-sm text-neutral-400">Price</div>
                  <div className="text-white font-medium">
                    ${coin.price?.toFixed(4) || "0.00"}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      coin.change > 0
                        ? "text-green-500"
                        : coin.change < 0
                        ? "text-red-500"
                        : "text-neutral-400"
                    }`}
                  >
                    {coin.change?.toFixed(2)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-400">Balance</div>
                  <div className="text-white font-medium">
                    ${((coin.amount || 0) * (coin.price || 0)).toFixed(2)}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {coin.amount} {coin.symbol.toUpperCase()}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            className="px-3 py-1 rounded hover:bg-neutral-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i)
            .filter((i) => {
              if (totalPages <= 7) return true;
              if (i === 0 || i === totalPages - 1) return true;
              if (Math.abs(i - page) <= 2) return true;
              if (page <= 2 && i <= 4) return true;
              if (page >= totalPages - 3 && i >= totalPages - 5) return true;
              return false;
            })
            .reduce((acc, curr, idx, arr) => {
              if (idx > 0 && curr - arr[idx - 1] > 1) {
                acc.push("ellipsis");
              }
              acc.push(curr);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-neutral-500">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`px-3 py-1 rounded ${
                    page === item
                      ? "bg-orange-500 text-white"
                      : "hover:bg-neutral-700"
                  }`}
                >
                  {item + 1}
                </button>
              )
            )}
          <button
            className="px-3 py-1 rounded hover:bg-neutral-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioOverview;
