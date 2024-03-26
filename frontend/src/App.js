import { ThemeProvider } from "styled-components";
import Navigation from "./components/Navigation";
import GlobalStyles from "./styles/GlobalStyles";
import { light } from "./styles/Themes";
import Home from "./components/sections/Home";
import About from "./components/sections/About";
import Showcase from "./components/sections/Showcase";
import Team from "./components/sections/Team";
import Faq from "./components/sections/Faq";
import Footer from "./components/Footer";
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Corrected the file name
import Login from './components/Login';
import Registration from './components/Registration';
import Share from './components/Share';
import RecommendPage from './components/RecommendPage'; // Added missing import
import Closet from './components/Closet'; // Added missing import
import { AuthProvider } from './components/AuthContext';
import './styles/App.css'; // You have this line duplicated, remove one.
import React, { useState } from 'react';
import AdminPanel from "./components/AdminPanel";
function App() {
  
  return (
    <AuthProvider> {/* This line is crucial */}
      <GlobalStyles />
      <ThemeProvider theme={light}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/Showcase" element={<Showcase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider> 
  );
}

export default App;
