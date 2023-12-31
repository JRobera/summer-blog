import React, { useContext } from "react";
import api from "../utility/axios";
import { Link, useNavigate } from "react-router-dom";
import { GoPerson } from "react-icons/go";
import { BsBookmarks } from "react-icons/bs";
import { BlogContext } from "../context/BlogContext";
import { generateError, generatesuccess } from "../utility/Toasts";

function ProfileCard() {
  const { setUser, setAccessToken } = useContext(BlogContext);

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

  return (
    <div className="flex flex-col gap-2 bg-[#557a95] absolute top-16 p-4 rounded-md z-20">
      <Link
        to="/profile"
        className="hover:text-white/70  flex gap-2 items-center"
      >
        <GoPerson />
        Profile
      </Link>
      <Link
        to="/book-marks"
        className="hover:text-white/70  flex gap-2 items-center"
      >
        <BsBookmarks />
        Library
      </Link>

      <button
        onClick={handleLogout}
        className="font-semibold mr-2 hover:text-white/70 "
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileCard;
