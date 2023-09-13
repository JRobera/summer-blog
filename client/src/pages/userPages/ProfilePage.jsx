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

function ProfilePage() {
  const { user, setUser } = useContext(BlogContext);
  const [isEditVisiable, setEditIsVisiable] = useState(false);
  const [isChangePasswordVisiable, setIsChangePasswordVisiable] =
    useState(false);
  const [publishedArticles, setPublishedArticles] = useState();

  const handleEditClick = () => {
    setEditIsVisiable(!isEditVisiable);
  };

  const handleChangeClick = () => {
    setIsChangePasswordVisiable(!isChangePasswordVisiable);
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    const fileExtention = file.name.split(".")[1];
    if (fileExtention !== "php") {
      const formData = new FormData();
      formData.append("profile-img", file);
      formData.append("id", user?._id);
      axios
        .post("http://localhost:3007/change-profile-image", formData)
        .then((res) => {
          if (res.status == 200) {
            generatesuccess(res.data);
            setUser(res.data);
          } else {
            generateError(res.data);
          }
        });
    } else {
      generateError("Invalid file formate!");
    }
  };

  // hide body scroll bar during profile edit
  useEffect(() => {
    if (isEditVisiable || isChangePasswordVisiable) {
      document.body.classList.add("hide");
    } else {
      document.body.classList.remove("hide");
    }
  }, [isEditVisiable, isChangePasswordVisiable]);

  useEffect(() => {
    axios
      .post("http://localhost:3007/get/published-article", { u_id: user?._id })
      .then((res) => {
        if (res.status == 200) {
          setPublishedArticles(res.data);
        } else {
          console.log("error");
          generateError(res.data);
        }
      })
      .catch((error) => {
        generateError(error);
      });
  }, []);

  const handleDelete = (id) => {
    setPublishedArticles(
      publishedArticles?.filter((article) => {
        return article?._id !== id;
      })
    );
    axios
      .post("http://localhost:3007/delete/article", { id: id })
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
        }
      })
      .catch((err) => {
        generateError(err.message);
      });
  };

  return (
    <div className=" px-2 relative">
      <NavBar />
      <div className="flex gap-2 min-h-screen mt-2 pt-4 relative flex-col-reverse md:flex-row">
        <div className="flex-[2] bg-[#7395ae] rounded-md">
          <UserTabs />
          <div className="no-scrollbar max-h-screen overflow-y-scroll">
            {publishedArticles?.map((article) => {
              return (
                <PublishedArticle
                  key={article?._id}
                  _id={article?._id}
                  header={article?.header}
                  thumbnail={article?.thumbnail}
                  content={article?.content}
                  createdAt={article?.createdAt}
                  handleDelete={handleDelete}
                />
              );
            })}
          </div>
        </div>
        <div className="bg-secondry flex-1 p-5 md:pl-10 md:pt-10 rounded-md">
          <div className="flex gap-2 items-center md:block">
            <div className="relative">
              <img
                className="w-20 h-20 max-h-20 rounded-full border-2 object-cover "
                src={user?.profile}
                alt="profile image"
              />
              <div
                title="Edit Profile"
                className=" p-1 rounded-full text-center w-7 flex items-center h-7 bg-[#557a95]/70 hover:cursor-pointer absolute top-0 left-0"
                onClick={() => {
                  let input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/png, image/jpeg, image/jpg ";
                  input.addEventListener("change", handleProfileImage);
                  input.click();
                }}
              >
                <BiEdit size={24} />
              </div>
            </div>
            <p>{user?.user}</p>
            <p
              className="text-sm hover:text-[#557a95] hover:underline"
              onClick={handleEditClick}
            >
              Edit profile
            </p>
            <p
              className="text-sm hover:text-[#557a95] hover:underline"
              onClick={handleChangeClick}
            >
              Change Password
            </p>
          </div>
        </div>
      </div>
      {isEditVisiable && <EditProfile handleEditClick={handleEditClick} />}
      {isChangePasswordVisiable && (
        <ChangePassword handleChangeClick={handleChangeClick} />
      )}
    </div>
  );
}

export default ProfilePage;
