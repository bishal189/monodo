import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/home";
import Forgot_Password from "./pages/Forgot_Password";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<Forgot_Password />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" newestOnTop closeOnClick pauseOnHover />
      </>
    </Router>
  );
}
