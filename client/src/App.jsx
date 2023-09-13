import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ProfilePage from "./pages/userPages/ProfilePage";
import LibraryPage from "./pages/LibraryPage";
import Blog from "./pages/Blog";
import PageNotFound from "./pages/PageNotFound";
import AdminLogin from "./pages/adminPages/AdminLogin";
import AdminDashBoard from "./pages/adminPages/AdminDashBoard";
import AdminProtectedRoutes from "./AdminProtectedRoutes";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/SigninPage";
import ForgotPassword from "./pages/ForgotPassword";
import UserProtectedRoutes from "./UserProtectedRoutes";
import SignupPage from "./pages/SignupPage";
import WriteArticle from "./pages/WriteArticle";
import ResetPassword from "./pages/ResetPassword";
import UpdateArticle from "./pages/adminPages/UpdateArticle";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token/:id" element={<ResetPassword />} />

        {/* User protected routes */}
        <Route element={<UserProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/book-marks" element={<LibraryPage />} />
          <Route path="/write/article" element={<WriteArticle />} />
          <Route path="/blog/:id" element={<Blog />} />
        </Route>

        {/* Admin pages */}
        <Route path="/login/admin/page" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoutes />}>
          <Route
            path="/admin/page/main/dashboard"
            element={<AdminDashBoard />}
          />
          <Route path="/update/article/:id" element={<UpdateArticle />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
