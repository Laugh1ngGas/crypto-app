import { useEffect, useState, useRef } from "react";
import axios from "axios";

const COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets";
const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";

const symbolMap = {
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
  BNBUSDT: "binancecoin",
  XRPUSDT: "ripple",
  ADAUSDT: "cardano",
  DOGEUSDT: "dogecoin",
  SOLUSDT: "solana",
  DOTUSDT: "polkadot",
  TRXUSDT: "tron",
  LTCUSDT: "litecoin",
};

const trackedSymbols = Object.keys(symbolMap);

const Cryptocurrencies = () => {
  const [coinData, setCoinData] = useState([]);
  const pricesRef = useRef({});

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const { data } = await axios.get(COINGECKO_URL, {
          params: {
            vs_currency: "usd",
            ids: Object.values(symbolMap).join(","),
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
          },
        });

        const formatted = data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          image: coin.image,
          price: 0,
          change: 0,
        }));

        setCoinData(formatted);
      } catch (err) {
        console.error("CoinGecko error:", err);
      }
    };

    fetchIcons();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(
      `${BINANCE_WS_URL}/!ticker@arr`
    );

    ws.onmessage = (event) => {
      const updates = JSON.parse(event.data);
      updates.forEach((u) => {
        if (trackedSymbols.includes(u.s)) {
          pricesRef.current[u.s] = {
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
      setCoinData((prev) =>
        prev.map((coin) => {
          const binanceSymbol = Object.keys(symbolMap).find(
            (k) => symbolMap[k] === coin.id
          );
          const update = pricesRef.current[binanceSymbol];
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <table className="min-w-full border text-left table-fixed border-neutral-700">
        <thead>
          <tr className="bg-gradient-to-r from-orange-500 to-orange-800">
            <th className="w-1/4 p-2">Coin</th>
            <th className="w-1/4 p-2">Price</th>
            <th className="w-1/4 p-2">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coinData.map((coin) => (
            <tr key={coin.id} className="border-b border-neutral-700">
              <td className="p-2 flex items-center gap-2 border-r border-neutral-700">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                {coin.name}
              </td>
              <td className="p-2 border-r border-neutral-700">${coin.price.toFixed(2)}</td>
              <td
                className={`p-2 ${
                  coin.change > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.change.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cryptocurrencies;
