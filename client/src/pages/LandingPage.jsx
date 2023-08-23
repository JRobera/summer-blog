import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../component/nav_bar/NavBar";

function LandingPage() {
  return (
    <div className="p-2">
      <nav className="flex bg-[#7395ae]  rounded-3xl mx-auto p-2 sticky top-1 z-20 shadow-lg">
        <a href="/" className=" w-8 h-8 rounded-full overflow-hidden">
          <img
            className=" w-full h-full"
            src="https://res.cloudinary.com/dbv6hao81/image/upload/v1692465041/logo_p8oote.jpg"
            alt="Blog logo"
          />
        </a>
        <div className="flex-1 text-right flex items-center justify-end gap-3">
          <a href="/signin" className="hover:text-[#557a61]">
            Login
          </a>
          <a
            href="/signup"
            className=" border-[#ffffff] border-solid border-[1px] rounded-2xl px-2 hover:text-[#557a95]"
          >
            Signup
          </a>
        </div>
      </nav>
      <p>Landing page</p>
      <Link to="/home">home</Link>
    </div>
  );
}

export default LandingPage;
