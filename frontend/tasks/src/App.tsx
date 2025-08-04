
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddPage";
import UpdatePage from "./pages/UpdatePage";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add/task" element={<AddTask />} />
        <Route path="/dashboard/tasks/:id/edit" element={<UpdatePage />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
