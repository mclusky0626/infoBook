import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Encyclopedia from "./pages/Encyclopedia";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"
import "./App.css";
import AdminPanel from "./pages/AdminPanel";

import PersonDetailPage from "./pages/PersonDetailPage";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/encyclopedia" element={<Encyclopedia />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        <Route path="/encyclopedia/:id" element={<PersonDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
