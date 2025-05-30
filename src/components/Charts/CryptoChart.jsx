import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Navbar from "../common/Navbar";
import { useAuth } from "../../contexts/authContext";
import Footer from "../common/Footer";

const CryptoChart = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { userLoggedIn } = useAuth();
  const [page, setPage] = useState(0);

  const [hideToolbar, setHideToolbar] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [fdmc, setFdmc] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);

  const latestDataRef = useRef(null);
  const throttleTimeout = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        width: "100%",
        height: 610,
        symbol: `${symbol.toUpperCase()}`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: 1,
        locale: "en",
        container_id: "tv_chart_container",
        withdateranges: true,
        hide_side_toolbar: hideToolbar,
        allow_symbol_change: false,
        save_image: true,
      });
    };

    containerRef.current.appendChild(script);
  }, [symbol, hideToolbar]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}`);
        setCoinDetails({
          name: res.data.name,
          image: res.data.image.large,
        });
        setFdmc(res.data.market_data?.fully_diluted_valuation?.usd || null);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  useEffect(() => {
    if (!symbol) return;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      latestDataRef.current = {
        price: parseFloat(data.c),
        priceChangePercent: parseFloat(data.P),
        volume: parseFloat(data.q),
      };

      if (!throttleTimeout.current) {
        throttleTimeout.current = setTimeout(() => {
          setPriceData(latestDataRef.current);
          throttleTimeout.current = null;
        }, 3000);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close();
    };

    return () => {
      ws.close();
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, [symbol]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 space-y-6 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 transition px-3 py-2 rounded-lg"
          >
            <ArrowLeft size={20} className="text-white" />
            {coinDetails && (
              <div className="flex items-center gap-2">
                <img src={coinDetails.image} alt={coinDetails.name} className="w-6 h-6 rounded-full" />
                <span className="text-md font-medium">{coinDetails.name}</span>
              </div>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-lg">
          <div>
            <div className="text-sm text-gray-400">PRICE / 24H CHANGE</div>
            <div className="text-xl font-semibold">
              ${priceData?.price?.toFixed(2) || "Loading..."}{" "}
              <span className={priceData?.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}>
                {priceData?.priceChangePercent?.toFixed(2) || "0.00"}%
              </span>
            </div>
          </div>

          {userLoggedIn && (
            <div className="flex gap-3">
              <button className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-700 transition">
                Receive
              </button>
              <button className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-700 transition">
                Send
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative">
            <div id="tv_chart_container" ref={containerRef} />
            <button
              onClick={() => setHideToolbar((prev) => !prev)}
              className={`absolute z-10 bg-gradient-to-r from-orange-500 to-orange-800 text-white px-0 py-1 rounded shadow-lg
                ${hideToolbar ? "bottom-80 left-1" : "bottom-80 left-12 ml-3"}`}
            >
              {hideToolbar ? ">" : "<"}
            </button>
          </div>

          {userLoggedIn && (
            <div className="bg-neutral-900 p-5 rounded-xl flex flex-col gap-4 shadow-xl">
              <h3 className="text-lg font-semibold text-white">Swap</h3>

              <div>
                <label className="text-sm text-gray-400">Sell</label>
                <div className="flex justify-between items-center bg-neutral-800 px-4 py-3 rounded-lg">
                  <span>{symbol.toUpperCase()}</span>
                  <span className="text-gray-400 text-sm">Max: --</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Buy</label>
                <div className="bg-neutral-800 px-4 py-3 rounded-lg">USDT</div>
              </div>

              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400"
              />

              <button className="bg-gradient-to-r from-orange-500 to-orange-800 px-4 py-3 rounded-lg text-white font-semibold hover:opacity-90">
                Swap
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-900 p-4 rounded">
            <div className="text-sm text-gray-400">FDMC</div>
            <div className="text-lg">${fdmc ? fdmc.toLocaleString() : "Loading..."}</div>
          </div>
          <div className="bg-neutral-900 p-4 rounded">
            <div className="text-sm text-gray-400">24H VOLUME</div>
            <div className="text-lg text-red-400">${priceData?.volume?.toLocaleString() || "Loading..."}</div>
          </div>
          <div className="bg-neutral-900 p-4 rounded">
            <div className="text-sm text-gray-400">LIQUIDITY</div>
            <div className="text-lg">$Loading...</div>
          </div>
        </div>
        <div>
          <Footer/>
        </div>   
      </div>
    </div>
  );
};

export default CryptoChart;
