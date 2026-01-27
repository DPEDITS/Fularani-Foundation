import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Missions from './pages/Missions';
import "./App.css";
import Navbar from './components/Navbar';
import Gallery from './pages/Gallery';
import DonorLogin from './pages/DonorLogin';
import DonorRegister from './pages/DonorRegister';
import Contact from './pages/Contact';
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/missions' element={<Missions />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/donor-login' element={<DonorLogin />} />
        <Route path='/donor-register' element={<DonorRegister />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  );
};

export default App;
