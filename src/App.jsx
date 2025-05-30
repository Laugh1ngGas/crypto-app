import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CryptoChart from "./components/Charts/CryptoChart.jsx";

import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import SignIn from "./pages/AuthPages/SignIn.jsx";
import SignUp from "./pages/AuthPages/SignUp.jsx";
import NotFoundPage from "./pages/OtherPages/NotFoundPage.jsx";
import Loader from "./components/common/LoadingScreen.jsx";
import Cryptocurrencies from "./pages/Cryptocurrencies/Cryptocurrencies.jsx";
import Portfolio from "./pages/Dashboard/Portfolio.jsx";
import DashboardCryptocurrencies from "./pages/Dashboard/Cryptocurrencies.jsx";
import VirtualPortfolio from "./pages/Dashboard/VirtualPortfolio.jsx";
import Settings from "./pages/Dashboard/Settings.jsx";
import DashboardCryptoCharts from "./components/Dashboard/CryptoChart.jsx";

const AppRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <Routes>
      <Route index path="/" element={<LandingPage />} />
      
      <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
      <Route path="/cryptocurrencies/:symbol" element={<CryptoChart />} />

      <Route path="/dashboard/portfolio" element={<Portfolio />} />
      <Route path="/dashboard/cryptocurrencies" element={<DashboardCryptocurrencies />} />
      <Route path="/dashboard/cryptocurrencies/:symbol" element={<DashboardCryptoCharts />} />
      <Route path="/dashboard/virtualportfolio" element={<VirtualPortfolio />} />
      <Route path="/dashboard/settings" element={<Settings />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
