import React, { useContext, useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import NavBar from "../../component/nav_bar/NavBar";
import EditProfile from "./EditProfile";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { BlogContext } from "../../context/BlogContext";
import axios from "axios";
import UserTabs from "./UserTabs";
import PublishedArticle from "./PublishedArticle";
import ChangePassword from "./ChangePassword";
import ProfileSidebar from "../../component/ProfileSidebar";

function ProfilePage() {
  const { user, setUser } = useContext(BlogContext);
  const [isEditVisiable, setEditIsVisiable] = useState(false);
  const [isChangePasswordVisiable, setIsChangePasswordVisiable] =
    useState(false);

  const handleEditClick = () => {
    setEditIsVisiable(!isEditVisiable);
  };

  const handleChangeClick = () => {
    setIsChangePasswordVisiable(!isChangePasswordVisiable);
  };

  // hide body scroll bar during profile edit
  useEffect(() => {
    if (isEditVisiable || isChangePasswordVisiable) {
      document.body.classList.add("hide");
    } else {
      document.body.classList.remove("hide");
    }
  }, [isEditVisiable, isChangePasswordVisiable]);

  return (
    <div className=" px-2 relative">
      <NavBar />
      <div className="flex gap-2 min-h-screen mt-2 pt-4 relative flex-col-reverse md:flex-row">
        <div className="flex-[2] bg-[#7395ae] rounded-md">
          <UserTabs />
          <div className="no-scrollbar max-h-screen overflow-y-scroll">
            <PublishedArticle />
          </div>
        </div>
        <ProfileSidebar
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

export default ProfilePage;
