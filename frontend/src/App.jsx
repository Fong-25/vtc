import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // New component
import toast, { Toaster } from "react-hot-toast";
import "./index.css"; // Ensure Tailwind is imported
import CreateCapsule from "./pages/CreateCapsule";

function App() {
  return (
    <Router>
      <Toaster /> {/* Global toast provider */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/create-capsule" element={<CreateCapsule />} />
      </Routes>
    </Router>
  );
}

export default App;