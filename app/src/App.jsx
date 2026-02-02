import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Missions from "./pages/Missions";
import "./App.css";
import Navbar from "./components/Navbar";
import Gallery from "./pages/Gallery";
import DonorLogin from "./pages/DonorLogin";
import DonorRegister from "./pages/DonorRegister";
import Contact from "./pages/Contact";
import AboutPage from "./pages/About";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerRegister from "./pages/VolunteerRegister";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[72px] md:pt-[88px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/donor-login" element={<DonorLogin />} />
          <Route path="/donor-register" element={<DonorRegister />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/volunteer-login" element={<VolunteerLogin />} />
          <Route path="/volunteer-register" element={<VolunteerRegister />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
