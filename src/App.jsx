import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/home";
import Forgot_Password from "./pages/Forgot_Password";
import Records from "./pages/Records";
import GetStarted from "./pages/GetStarted";
import Faq from "./pages/Faq";
import Invite from "./pages/Invite";
import About from "./pages/About";
import Deposit from "./pages/Deposit";
import Support from "./pages/Support";
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
          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <Records />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <Faq />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/get-started"
            element={
              <ProtectedRoute>
                <GetStarted />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invite"
            element={
              <ProtectedRoute>
                <Invite />
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
