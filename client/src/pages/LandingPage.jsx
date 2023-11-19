import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../component/nav_bar/NavBar";

function LandingPage() {
  return (
    <div className="p-2 min-h-screen">
      <nav className="flex bg-[#7395ae]  rounded-3xl mx-auto p-2 sticky top-1 z-20 shadow-lg">
        <Link to="/" className=" w-8 h-8 rounded-full overflow-hidden">
          <img
            className=" w-full h-full"
            src="https://res.cloudinary.com/dbv6hao81/image/upload/v1692465041/logo_p8oote.jpg"
            alt="Blog logo"
          />
        </Link>
        <div className="flex-1 text-right flex items-center justify-end gap-3">
          <Link to="/signin" className="hover:text-white/70">
            Login
          </Link>
          <Link
            to="/signup"
            className=" border-white border-solid border-[1px] rounded-2xl px-2 hover:text-white/70"
          >
            Signup
          </Link>
        </div>
      </nav>
      <main className="flex flex-col gap-2 min-h-screen mt-2 rounded-md overflow-hidden sm:flex-row">
        <img
          className="sm:w-1/2 rounded-md sm:rounded-none min-h-[400px]"
          src="https://res.cloudinary.com/dbv6hao81/image/upload/v1694610201/quil_ns1ryb.jpg"
          alt="landing page picture"
        />
        <div className="flex flex-col gap-4 items-center justify-center sm:w-1/2">
          <h1 className=" w-11/12 text-3xl sm:text-5xl font-bold ">
            Share your Knowleage with the world
          </h1>
          <div className="text-center">
            <p className="w-11/12 text-sm text-left mb-4 mx-auto">
              Welcome to our blog, a platform dedicated to sharing knowledge and
              insights from a diverse community of contributors like you. We
              believe that everyone has valuable expertise and unique
              experiences to share, and we invite you to become a part of our
              vibrant community.
            </p>
            <Link
              to="/signup"
              className=" border-white border-solid border-[1px] rounded-2xl px-2 hover:text-white/70"
            >
              Signup
            </Link>
          </div>
        </div>
      </main>
      {/* <Link to="/home">home</Link> */}
    </div>
  );
}

export default LandingPage;
