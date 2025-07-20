import React from "react";
import { AuthProvider } from "./context";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";
import { TaskProvider } from "./context/TaskProvider";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
          <Route path="/dashboard" element={<TaskProvider><Dashboard/></TaskProvider>} />
        
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
};

export default App;
