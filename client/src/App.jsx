import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import PageNotFound from "./pages/PageNotFound";
import AdminLogin from "./pages/adminPages/AdminLogin";
import AdminDashBoard from "./pages/adminPages/AdminDashBoard";
import AdminProtectedRoutes from "./AdminProtectedRoutes";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/SigninPage";
import ForgotePassword from "./pages/ForgotePassword";
import UserProtectedRoutes from "./UserProtectedRoutes";
import SignupPage from "./pages/SignupPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotePassword />} />

        {/* User protected routes */}
        <Route element={<UserProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog/:id" element={<Blog />} />
        </Route>

        {/* Admin pages */}
        <Route path="/login/admin/page" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoutes />}>
          <Route
            path="admin/page/main/dashboard"
            element={<AdminDashBoard />}
          />
        </Route>
        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
