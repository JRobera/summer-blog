import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLink from "./NavLink";
import HamBurgerMenu from "../HamBurgerMenu";
import { TfiWrite } from "react-icons/tfi";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { BlogContext } from "../../context/BlogContext";
import SearchArticle from "../SearchArticle";
import { BsSearch } from "react-icons/bs";
import ProfileCard from "../ProfileCard";
import api from "../../utility/axios";

function NavBar() {
  const { user, setUser, accessToken, setAccessToken } =
    useContext(BlogContext);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileVisiable, setIsProfileVisiable] = useState(false);
  const { articles, setArticles } = useContext(BlogContext);
  const [SearchVisiable, setSearchVisiable] = useState(false);

  useEffect(() => {
    api.get("/get/articles").then((response) => {
      if (response.status == 200) {
        setArticles(response.data);
      }
    });
  }, []);

  const handleMenuClick = () => {
    setIsNavOpen(!isNavOpen);
  };

  const history = useNavigate();
  const redirect = () => {
    history("/");
  };

  const handleLogout = () => {
    api
      .post(
        "/logout",
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

  const handleSearchClick = () => {
    setSearchVisiable(!SearchVisiable);
  };

  const links = [
    { link: "/home", linkName: "Home", color: "" },
    { link: "/about", linkName: "About", color: "" },
    { link: "/contact", linkName: "Contact", color: "" },
  ];

  return (
    <nav className="flex gap-3 items-center bg-[#7395ae] rounded-full mx-auto p-2 sticky top-1 z-20 shadow-lg">
      <Link
        to={accessToken ? "/home" : "/"}
        className=" w-8 h-8 rounded-full overflow-hidden"
      >
        <img
          className=" w-full h-full"
          src="https://res.cloudinary.com/dbv6hao81/image/upload/v1692465041/logo_p8oote.jpg"
          alt="Blog logo"
        />
      </Link>
      <SearchArticle articles={articles} isvisiable={SearchVisiable} />
      {/* <div className=""> */}
      <div className="flex gap-2 items-center flex-1 justify-end">
        <div className=" sm:hidden" onClick={handleSearchClick}>
          <BsSearch size={15} />
        </div>
        <Link to="/write/article">
          <div className="flex gap-2 items-center ml-4">
            <TfiWrite />
            <p>Write</p>
          </div>
        </Link>

        <div
          className=" rounded-full w-8 h-8 overflow-hidden"
          onClick={() => {
            setIsProfileVisiable(!isProfileVisiable);
          }}
        >
          <img
            src={user?.profile}
            className=" object-cover w-full h-full"
            alt="Profile image"
          />
        </div>
        {isProfileVisiable && <ProfileCard />}
      </div>
      {/* </div> */}

      {/* <HamBurgerMenu handleMenuClick={handleMenuClick} /> */}
    </nav>
  );
}

export default NavBar;
