import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Missions from "./pages/Missions";
import MissionInfo from "./pages/MissionInfo";
import StoryInfo from "./pages/StoryInfo";
import "./App.css";
import Navbar from "./components/Navbar";
import Gallery from "./pages/Gallery";
import DonorLogin from "./pages/DonorLogin";
import DonorRegister from "./pages/DonorRegister";
import DonorDashboard from "./pages/DonorDashboard";
import Contact from "./pages/Contact";
import AboutPage from "./pages/About";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerRegister from "./pages/VolunteerRegister";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CSRPartnership from "./pages/CSRPartnership";
import AdminDashboard from "./pages/AdminDashboard";
import AddContent from "./pages/AddContent";
import ResetPassword from "./pages/ResetPassword";
import LegalPolicy from "./pages/LegalPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = [
    "/donor-login",
    "/donor-register",
    "/volunteer-login",
    "/volunteer-register",
    "/reset-password"
  ];

  const shouldHideFooter = hideFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/:id" element={<MissionInfo />} />
          <Route path="/stories/:id" element={<StoryInfo />} />
          <Route path="/csr-partnership" element={<CSRPartnership />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/donor-login" element={<DonorLogin />} />
          <Route path="/donor-register" element={<DonorRegister />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/volunteer-login" element={<VolunteerLogin />} />
          <Route path="/volunteer-register" element={<VolunteerRegister />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-content" element={<AddContent />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/legal-policy" element={<LegalPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default App;
