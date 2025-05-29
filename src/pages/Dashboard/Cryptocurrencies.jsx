import Footer from "../../components/common/Footer.jsx";
import Sidebar from "../../components/Dashboard/Sidebar.jsx";
import TopBar from "../../components/Dashboard/TopBar.jsx";
import { useAuth } from "../../contexts/authContext";

const DashboardCryptocurrencies = () => {
    const { userLoggedIn, currentUser } = useAuth();

    return (
        <div>
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-start gap-4">            
                <Sidebar />
                <TopBar user={currentUser} className="w-full"/>
            </div>
            <Footer />
        </div>
        </div>
    );
};

export default DashboardCryptocurrencies;
