import Footer from "../../components/common/Footer.jsx";
import Sidebar from "../../components/Dashboard/Sidebar.jsx";
import TopBar from "../../components/Dashboard/TopBar.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useParams } from "react-router-dom";
import CryptoChart from "../../components/Dashboard/CryptoChart/CryptoChart.jsx";

const DashboardCryptoCharts = () => {
  const { symbol } = useParams();
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-4">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <TopBar user={currentUser} />
          <div className="flex-1 overflow-y-auto p-4">
            <CryptoChart symbol={symbol} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardCryptoCharts;
