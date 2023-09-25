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

  const [publishedArticles, setPublishedArticles] = useState();

  useEffect(() => {
    axios
      .post("https://summer-blog-api.onrender.com/get/published-article", {
        u_id: user?._id,
      })
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
      .post("https://summer-blog-api.onrender.com/delete/article", { id: id })
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
        }
      })
      .catch((err) => {
        generateError(err.message);
      });
  };

  const formattedDate = (createdAt) => {
    const postDate = new Date(createdAt);
    return postDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className=" px-2 relative">
      <NavBar />
      <div className="flex gap-2 min-h-screen mt-2 pt-4 relative flex-col-reverse md:flex-row">
        <div className="flex-[2] bg-[#7395ae] rounded-md">
          <UserTabs />
          <div className="no-scrollbar max-h-screen overflow-y-scroll">
            {publishedArticles?.map((article) => (
              <PublishedArticle
                key={article?._id}
                _id={article?._id}
                header={article?.header}
                thumbnail={article?.thumbnail}
                content={article?.content}
                createdAt={formattedDate(article?.createdAt)}
                handleDelete={handleDelete}
              />
            ))}
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
