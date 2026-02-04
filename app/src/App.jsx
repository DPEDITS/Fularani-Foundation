import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Missions from "./pages/Missions";
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
import CSRPartnership from "./pages/CSRPartnership";

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = [
    "/donor-login",
    "/donor-register",
    "/volunteer-login",
    "/volunteer-register",
  ];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/csr-partnership" element={<CSRPartnership />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/donor-login" element={<DonorLogin />} />
          <Route path="/donor-register" element={<DonorRegister />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/volunteer-login" element={<DonorLogin />} />
          <Route path="/volunteer-register" element={<DonorRegister />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default App;
