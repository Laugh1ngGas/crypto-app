import Navbar from "../../components/common/Navbar.jsx";
import HeroSection from "../../components/Landing/HeroSection.jsx";
import FeatureSection from "../../components/Landing/FeatureSection.jsx";
import Workflow from "../../components/Landing/WorkflowSection.jsx";
import Pricing from "../../components/Landing/Pricing.jsx";
import Testimonials from "../../components/Landing/Testimonials.jsx";
import Footer from "../../components/common/Footer.jsx";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <Workflow />
        {/* <Pricing /> */}
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
