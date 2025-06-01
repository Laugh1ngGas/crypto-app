import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { Search } from "lucide-react";
import Footer from "../../components/common/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const COINGECKO_MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets";
const BINANCE_INFO_URL = "https://api.binance.com/api/v3/exchangeInfo";
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/!ticker@arr";

const ITEMS_PER_PAGE = 30;

const Cryptocurrencies = () => {
  const [allSymbols, setAllSymbols] = useState([]);
  const [allCoinData, setAllCoinData] = useState([]);
  const [binanceNames, setBinanceNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const pricesRef = useRef({});

  useEffect(() => {
    const fetchBinanceSymbols = async () => {
      try {
        const res = await axios.get(BINANCE_INFO_URL);
        const symbolsData = res.data.symbols;

        const namesMap = {};
        const usdtSymbols = [];

        symbolsData.forEach((s) => {
          if (s.symbol.endsWith("USDT") && s.status === "TRADING") {
            namesMap[s.baseAsset] = s.baseAsset;
            usdtSymbols.push(s.symbol);
          }
        });

        setBinanceNames(namesMap);
        setAllSymbols(usdtSymbols);
      } catch (error) {
        console.error("Error fetching Binance symbols:", error);
      }
    };
    fetchBinanceSymbols();
  }, []);

  useEffect(() => {
    const fetchCoinData = async () => {
      if (allSymbols.length === 0) return;

      try {
        const idsRes = await axios.get("https://api.coingecko.com/api/v3/coins/list");
        const allCoins = idsRes.data;

        const idMap = {};
        allCoins.forEach((coin) => {
          idMap[coin.symbol.toUpperCase()] = coin.id;
        });

        const validPairs = allSymbols
          .map((symbol) => {
            const baseSymbol = symbol.replace("USDT", "");
            return {
              symbol,
              id: idMap[baseSymbol],
              baseSymbol,
            };
          })
          .filter((p) => p.id);

        const batched = [];
        for (let i = 0; i < validPairs.length; i += 100) {
          batched.push(validPairs.slice(i, i + 100));
        }

        const results = await Promise.all(
          batched.map((batch) =>
            axios
              .get(COINGECKO_MARKETS_URL, {
                params: {
                  vs_currency: "usd",
                  ids: batch.map((b) => b.id).join(","),
                },
              })
              .then((res) => res.data)
          )
        );

        const flatData = results.flat();

        const coinData = validPairs.map((pair) => {
          const coin = flatData.find((c) => c.id === pair.id);
          return {
            id: pair.id,
            symbol: pair.baseSymbol + "USD",
            name: binanceNames[pair.baseSymbol] || pair.baseSymbol,
            image: coin?.image || "",
            price: 0,
            change: 0,
          };
        });

        setAllCoinData(coinData);
      } catch (error) {
        console.error("Error fetching CoinGecko data:", error);
      }
    };

    fetchCoinData();
  }, [allSymbols, binanceNames]);

  useEffect(() => {
    const ws = new WebSocket(BINANCE_WS_URL);
    ws.onmessage = (event) => {
      const updates = JSON.parse(event.data);
      updates.forEach((u) => {
        if (u.s.endsWith("USDT")) {
          const base = u.s.replace("USDT", "");
          pricesRef.current[base + "USD"] = {
            price: parseFloat(u.c),
            change: parseFloat(u.P),
          };
        }
      }); 
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAllCoinData((prev) =>
        prev.map((coin) => {
          const update = pricesRef.current[coin.symbol];
          return update
            ? {
                ...coin,
                price: update.price,
                change: update.change,
              }
            : coin;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div>
      <Navbar/>
      <div className="max-w-5xl mx-auto p-4">
        <div className="relative text-white mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-neutral-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="rounded-xl overflow-hidden border border-neutral-800">
          <table className="min-w-full table-fixed border text-left rounded border-neutral-700 overflow-x-auto text-sm sm:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-800 text-white text-xs sm:text-sm">
                <th className="w-[140px] p-2 cursor-pointer" onClick={() => toggleSort("name")}>
                  <div className="text-lg flex items-center gap-1">
                    Coin
                    <div className="flex flex-col leading-none">
                      <ChevronUp size = {12} className={sortConfig.key === "name" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}/>
                      <ChevronDown size = {12} className={sortConfig.key === "name" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}/>
                    </div>
                  </div>
                </th>
                <th className="w-[120px] p-2 cursor-pointer" onClick={() => toggleSort("price")}>
                  <div className="text-lg flex items-center gap-1">
                    Price
                    <div className="flex flex-col text-[10px] leading-none">
                      <ChevronUp size = {12} className={sortConfig.key === "price" && sortConfig.direction === "asc" ? "text-white" : "text-gray-400"}/>
                      <ChevronDown size = {12} className={sortConfig.key === "price" && sortConfig.direction === "desc" ? "text-white" : "text-gray-400"}/>
                    </div>
                  </div>
                </th>
                <th className="w-[120px] p-2">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {visibleCoins.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-white">
                    No coins found
                  </td>
                </tr>
              )}
              {visibleCoins.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-t border-neutral-700 text-white cursor-pointer hover:bg-neutral-800 transition-colors duration-200"
                >
                  <td className="flex items-center gap-3 p-2">
                    <Link to={`/cryptocurrencies/${coin.symbol}`} className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="bg-neutral-800 rounded-2xl w-8 h-8 " />
                      <div>
                        <div className="font-bold">{coin.name}</div>
                        <div className="text-sm text-gray-300">{coin.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-2">${coin.price.toFixed(4)}</td>
                  <td className={`p-2 ${coin.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {coin.change.toFixed(2)}%
                  </td>
                </tr>
              ))}

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
        <Footer />
      </div>
    </div>
  );
};

export default Cryptocurrencies;
