import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import SignIn from "./pages/AuthPages/SignIn.jsx";
import SignUp from "./pages/AuthPages/SignUp.jsx";
import NotFoundPage from "./pages/OtherPages/NotFoundPage.jsx";
import Loader from "./components/common/LoadingScreen.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

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

        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/markets/overview" element={<Market />} /> */}
        {/* <Route path="/crypto/buy" element={<BuyCrypto />} /> */}

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
