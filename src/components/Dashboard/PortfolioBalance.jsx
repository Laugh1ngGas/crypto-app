import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config"; // Імпорт Firestore (налаштування мають бути у вас)
import { collection, query, where, onSnapshot } from "firebase/firestore";

const PortfolioBalance = ({ user }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [changeValue, setChangeValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Підписка на портфель користувача у Firestore
    const q = query(collection(db, "portfolio"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coins = snapshot.docs.map((doc) => doc.data());
      setPortfolio(coins);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (portfolio.length === 0) {
      setBalance(0);
      setChangePercent(0);
      setChangeValue(0);
      setLoading(false);
      return;
    }

    const symbols = portfolio.map((coin) => coin.symbol.toLowerCase());

    // Отримуємо дані з CoinGecko для всіх монет портфеля
    const fetchCoinData = async () => {
      setLoading(true);
      try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;

        // Але нам потрібні монети за символом, а CoinGecko приймає id монети, тож зробимо додатковий крок:
        // Отримаємо всі монети з CoinGecko, щоб побудувати відповідність symbol → id
        const coinsListResp = await fetch("https://api.coingecko.com/api/v3/coins/list");
        const coinsList = await coinsListResp.json();

        // Map symbol to id (для монет, які є у портфелі)
        const symbolToIdMap = {};
        coinsList.forEach((coin) => {
          if (symbols.includes(coin.symbol.toLowerCase())) {
            symbolToIdMap[coin.symbol.toLowerCase()] = coin.id;
          }
        });

        // Формуємо рядок id для запиту (через кому)
        const ids = Object.values(symbolToIdMap).join(",");

        if (!ids) {
          // Якщо не знайшли жодної монети — обнуляємо і завершуємо
          setBalance(0);
          setChangePercent(0);
          setChangeValue(0);
          setLoading(false);
          return;
        }

        // Отримуємо ринкові дані по id монет
        const marketResp = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`
        );
        const marketData = await marketResp.json();

        // Порахувати загальний баланс і зміну
        let totalBalance = 0;
        let totalPrevBalance = 0;

        portfolio.forEach(({ symbol, amount }) => {
          const id = symbolToIdMap[symbol.toLowerCase()];
          if (!id) return;
          const coinMarket = marketData.find((c) => c.id === id);
          if (!coinMarket) return;

          const priceNow = coinMarket.current_price || 0;
          const changePct24h = coinMarket.price_change_percentage_24h || 0;

          const amountNum = Number(amount) || 0;

          totalBalance += priceNow * amountNum;
          // Щоб знайти баланс 24 години тому: 
          // price_24h_ago = priceNow / (1 + changePct24h/100)
          const price24hAgo = priceNow / (1 + changePct24h / 100);
          totalPrevBalance += price24hAgo * amountNum;
        });

        const diffValue = totalBalance - totalPrevBalance;
        const diffPercent = totalPrevBalance ? (diffValue / totalPrevBalance) * 100 : 0;

        setBalance(totalBalance);
        setChangeValue(diffValue);
        setChangePercent(diffPercent);
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setBalance(0);
        setChangePercent(0);
        setChangeValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [portfolio]);

  if (loading) return <div>Loading balance...</div>;

  return (
    <div className="p-4 bg-gray-900 rounded text-white max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-2">Portfolio Balance</h2>
      <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
      <div
        className={`mt-1 text-lg ${
          changePercent > 0 ? "text-green-500" : changePercent < 0 ? "text-red-500" : "text-neutral-400"
        }`}
      >
        {changePercent >= 0 ? "+" : ""}
        {changePercent.toFixed(2)}% (${changeValue.toFixed(2)})
      </div>
    </div>
  );
};

export default PortfolioBalance;
