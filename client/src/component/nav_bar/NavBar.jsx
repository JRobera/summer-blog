import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLink from "./NavLink";
import HamBurgerMenu from "../HamBurgerMenu";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { BlogContext } from "../../context/BlogContext";

function NavBar() {
  const { user } = useContext(BlogContext);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleMenuClick = () => {
    setIsNavOpen(!isNavOpen);
  };

  const history = useNavigate();
  const redirect = () => {
    history("/");
  };

  const hanldeLogout = () => {
    axios
      .post(
        "http://localhost:3007/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status == 200) {
          redirect();
          generatesuccess(res.data);
          setUser({});
          setAccessToken({});
        } else {
          generateError();
        }
      });
  };

  const links = [
    { link: "/home", linkName: "Home", color: "" },
    { link: "/about", linkName: "About", color: "" },
    { link: "/contact", linkName: "Contact", color: "" },
  ];

  return (
    <nav className="flex items-center bg-[#7395ae] rounded-3xl mx-auto p-2 sticky top-1 z-20 shadow-lg relative">
      <a href="/" className=" w-8 h-8 rounded-full overflow-hidden">
        <img
          className=" w-full h-full"
          src="https://res.cloudinary.com/dbv6hao81/image/upload/v1692465041/logo_p8oote.jpg"
          alt="Blog logo"
        />
      </a>
      <div
        className={
          isNavOpen
            ? "md:static md:flex-row md:gap-10 md:bg-transparent md:scale-100 md:translate-x-0 md:opacity-100 inline-flex flex-col gap-4 flex-grow justify-center text-center bg-[#7395ae] absolute -bottom-32 top-12 left-1/2 -translate-x-1/2 rounded-b-md w-4/5 transition duration-150 "
            : "md:static md:flex-row md:gap-10 md:bg-transparent md:scale-100 md:translate-x-0 md:opacity-100 inline-flex flex-col gap-4 flex-grow justify-center text-center w-full bg-[#7395ae] -bottom-0 top-0 left-0  transition absolute scale-50  opacity-0 duration-150"
        }
      >
        <div
          className={
            isNavOpen
              ? "md:static md:flex-row md:gap-10 md:translate-x-0 inline-flex flex-col gap-4 flex-grow justify-center "
              : "md:static md:flex-row md:gap-10 md:translate-x-0 inline-flex flex-col gap-4 flex-grow justify-center  "
          }
        >
          {links.map((link, i) => {
            return (
              <NavLink key={i} link={link.link} linkName={link.linkName} />
            );
          })}
        </div>

        <div className="flex gap-2 items-center justify-center">
          {user?.user}
          <button
            onClick={hanldeLogout}
            className="font-semibold mr-2 hover:text-[#557a95]"
          >
            Logout
          </button>
          <div className=" rounded-full w-8 h-8 overflow-hidden">
            <img
              src="/image/logo.jpg"
              className=" object-fill w-full h-full"
              alt=""
            />
          </div>
        </div>
      </div>

      <HamBurgerMenu handleMenuClick={handleMenuClick} />
    </nav>
  );
}

export default NavBar;
