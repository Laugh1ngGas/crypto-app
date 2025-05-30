import { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/list";
const COINGECKO_MARKETS = "https://api.coingecko.com/api/v3/coins/markets";
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/!ticker@arr";
const ITEMS_PER_PAGE = 7;

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [user] = useAuthState(auth);
  const pricesRef = useRef({});
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(0);
  const [allCoinData, setAllCoinData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  let filteredData = allCoinData.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "name") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const visibleCoins = filteredData.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

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
    <div className="max-w-6xl mx-auto p-4 text-white">
      {/* {error && (
        <div className="bg-red-800 text-red-200 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )} */}
      <div className="rounded-xl overflow-hidden border border-neutral-800">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th
                className="text-left px-4 py-3 w-[200px] cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  <div className="flex flex-col ml-1">
                    <ChevronUp
                      className={`w-3 h-3 ${
                        sortConfig.key === "name" && sortConfig.direction === "asc"
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${
                        sortConfig.key === "name" && sortConfig.direction === "desc"
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th
                className="text-left px-4 py-3 w-[160px] cursor-pointer select-none"
                onClick={() => toggleSort("price")}
              >
                <div className="flex items-center gap-1">
                  Price / 24H
                  <div className="flex flex-col ml-1">
                    <ChevronUp
                      className={`w-3 h-3 ${
                        sortConfig.key === "price" && sortConfig.direction === "asc"
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${
                        sortConfig.key === "price" && sortConfig.direction === "desc"
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th
                className="text-left px-4 py-3 w-[180px] cursor-pointer select-none"
                onClick={() => toggleSort("balance")}
              >
                <div className="flex items-center gap-1">
                  Balance
                  <div className="flex flex-col ml-1">
                    <ChevronUp
                      className={`w-3 h-3 ${
                        sortConfig.key === "balance" && sortConfig.direction === "asc"
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${
                        sortConfig.key === "balance" && sortConfig.direction === "desc"
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {allCoinData.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-neutral-400">
                  Loading portfolio...
                </td>
              </tr>
            ) : (
              visibleCoins.map((coin) => (
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
                        {coin.change?.toFixed(2) || "0.00"}%
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      {(coin.amount || 0).toFixed(4)} {coin.symbol.toUpperCase()}
                    </div>
                    <div className="text-neutral-400">
                      ${((coin.amount || 0) * (coin.price || 0)).toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
    </div>
  );
};

export default PortfolioOverview;
