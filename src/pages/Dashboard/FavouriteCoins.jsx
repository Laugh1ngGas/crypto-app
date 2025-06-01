import Footer from "../../components/common/Footer.jsx";
import Sidebar from "../../components/Dashboard/Sidebar.jsx";
import TopBar from "../../components/Dashboard/TopBar.jsx";
import { useAuth } from "../../contexts/authContext/index.jsx";
import MaintenancePlaceholder from "../../components/common/UnderDevelopment.jsx";

const FavouriteCoins = () => {
    const { userLoggedIn, currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-4">
          <Sidebar />
          <div className="flex flex-col flex-1">
              <TopBar user={currentUser} />
              <div className="flex-1 overflow-y-auto p-4">
                <MaintenancePlaceholder />
              </div>     
          </div>
        </div>
        <Footer />
    </div>
  );
};

export default FavouriteCoins;
