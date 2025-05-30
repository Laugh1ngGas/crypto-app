import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const COINGECKO_MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets";
const BINANCE_INFO_URL = "https://api.binance.com/api/v3/exchangeInfo";
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/!ticker@arr";
const ITEMS_PER_PAGE = 13;

const MarketOverview = () => {
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
    <div className="max-w-6xl mx-auto p-4 text-white">
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search coin..."
            className="pl-9 pr-4 py-2 rounded-md bg-neutral-800 text-sm text-white placeholder-neutral-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-neutral-800">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="text-left px-4 py-3 w-[200px]">Name</th>
              <th className="text-left px-4 py-3 w-[160px]">Price / 24H</th>
            </tr>
          </thead>
          <tbody>
  {allCoinData.length === 0 ? (
    <tr>
      <td colSpan="2" className="text-center py-6 text-neutral-400">
        Loading coins...
      </td>
    </tr>
  ) : (
    allCoinData
      .filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
      .map((coin) => (
        <tr
          key={coin.symbol}
          className="border-t border-neutral-800 hover:bg-neutral-900 transition cursor-pointer"
        >
          <td className="px-4 py-4">
            <Link
              to={`/dashboard/cryptocurrencies/${coin.symbol}`}
              className="flex items-center gap-3 overflow-hidden"
            >
              <img
                src={coin.image}
                alt={coin.name}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="truncate">
                <div className="font-medium truncate">{coin.name}</div>
                <div className="text-xs text-neutral-400 uppercase truncate">
                  {coin.symbol.replace("USD", "")}
                </div>
              </div>
            </Link>
          </td>
          <td className="px-4 py-4">
            <Link to={`/dashboard/cryptocurrencies/${coin.symbol}`}>
              <div>${pricesRef.current[coin.symbol]?.price?.toFixed(4) || "0.0000"}</div>
              <div
                className={`text-sm font-semibold ${
                  pricesRef.current[coin.symbol]?.change > 0
                    ? "text-green-500"
                    : pricesRef.current[coin.symbol]?.change < 0
                    ? "text-red-500"
                    : "text-neutral-400"
                }`}
              >
                {pricesRef.current[coin.symbol]?.change?.toFixed(2) || "0.00"}%
              </div>
            </Link>
          </td>
        </tr>
      ))
  )}
</tbody>

        </table>
      </div>

      {/* Pagination (optional) */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 bg-neutral-800 rounded hover:bg-neutral-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 bg-neutral-800 rounded hover:bg-neutral-700 disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * ITEMS_PER_PAGE >= allCoinData.length}
        >
          Next
        </button>
      </div>
    </div>
  );

};

export default MarketOverview;
