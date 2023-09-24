import React, { useContext, useEffect, useState } from "react";
import NavBar from "../component/nav_bar/NavBar";
import EditProfile from "./userPages/EditProfile";
import { generateError, generatesuccess } from "../utility/Toasts";
import BookMarkItem from "./BookMarkItem";
import { BlogContext } from "../context/BlogContext";
import axios from "axios";
import ChangePassword from "./userPages/ChangePassword";
import ProfileSidebar from "../component/ProfileSidebar";

function LibraryPage() {
  const { user } = useContext(BlogContext);
  const [isEditVisiable, setEditIsVisiable] = useState(false);
  const [isChangePasswordVisiable, setIsChangePasswordVisiable] =
    useState(false);

  const handleEditClick = () => {
    setEditIsVisiable(!isEditVisiable);
  };

  const handleChangeClick = () => {
    setIsChangePasswordVisiable(!isChangePasswordVisiable);
  };

  useEffect(() => {
    if (isEditVisiable || isChangePasswordVisiable) {
      document.body.classList.add("hide");
    } else {
      document.body.classList.remove("hide");
    }
  }, [isEditVisiable, isChangePasswordVisiable]);

  return (
    <div className="p-2 min-h-screen">
      <NavBar />
      <div className="flex pt-4 gap-2 h-full flex-col-reverse md:flex-row">
        <div className="no-scrollbar flex-[2] flex flex-col gap-2 max-h-screen overflow-y-scroll">
          <BookMarkItem />
        </div>

        <ProfileSidebar
          user={user?.user}
          profile={user?.profile}
          handleEditClick={handleEditClick}
          handleChangeClick={handleChangeClick}
        />
      </div>
      {isEditVisiable && <EditProfile handleEditClick={handleEditClick} />}
      {isChangePasswordVisiable && (
        <ChangePassword handleChangeClick={handleChangeClick} />
      )}
    </div>
  );
}

export default LibraryPage;
