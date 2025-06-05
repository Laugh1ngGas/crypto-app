import Footer from "../../components/common/Footer.jsx";
import Sidebar from "../../components/Dashboard/Sidebar.jsx";
import TopBar from "../../components/Dashboard/TopBar.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import MaintenancePlaceholder from "../../components/common/UnderDevelopment.jsx";
import { useState } from "react";

const Settings = () => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-4">
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onCloseMobile={() => setMobileMenuOpen(false)} 
        />
        <div className="flex flex-col flex-1">
          <TopBar user={currentUser} onBurgerClick={toggleMobileMenu} />
            <div className="flex-1 overflow-y-auto p-4">
              <MaintenancePlaceholder />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
