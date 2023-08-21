import React, { useContext, useEffect, useState } from "react";
import ArticleDetailes from "./ArticleDetailes";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { useNavigate } from "react-router-dom";
import { BlogContext } from "../../context/BlogContext";
import { ToastContainer } from "react-toastify";

function AdminHomePage() {
  const { admin, setAdmin, articles, setArticles } = useContext(BlogContext);
  const [profileBG, setProfileBG] = useState("");

  const history = useNavigate();

  const redirect = () => {
    history("/login/admin/page");
  };

  const handleSelectCoverImage = (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("profile-bg", file);
    formData.append("id", admin?._id);
    axios.post("http://localhost:3007/change-bg", formData).then((res) => {
      if (res.status == 200) {
        generatesuccess(res.data);
        setAdmin(res.data);
      } else {
        generateError(res.data);
      }
    });
  };

  useEffect(() => {
    axios.get("http://localhost:3007/get/articles").then((response) => {
      if (response.status == 200) {
        setArticles(response.data);
      }
    });
  }, []);

  return (
    <section
      id="admin-home"
      className="flex-1 flex flex-col overflow-x-hidden min-h-screen"
    >
      <div
        className=" min-h-[100px] p-4 flex items-center bg-cover"
        style={{ backgroundImage: `url(${admin?.profile})` }}
      >
        <div
          title="Edit Dashboard Profile"
          className=" p-3 rounded-full text-center w-10 flex items-center h-10 bg-[#7396ae]/70 hover:cursor-pointer"
          onClick={() => {
            let input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.addEventListener("change", handleSelectCoverImage);
            input.click();
          }}
        >
          <box-icon name="edit-alt" size="20px" color="white"></box-icon>
        </div>
        <div className="flex gap-2  flex-1 justify-end items-center">
          <button
            className="bg-[#7396ae]/70 p-2 rounded-lg hover:text-[#557a95]"
            title="Logout"
            onClick={() => {
              axios
                .post(
                  "http://localhost:3007/admin/logout",
                  {},
                  {
                    withCredentials: true,
                  }
                )
                .then((res) => {
                  if (res.status == 200) {
                    generatesuccess(res.data);
                    setAdmin({});
                    redirect();
                  }
                });
            }}
          >
            Logout
          </button>
          <p className="bg-[#7396ae]/70 p-2 rounded-full" title="Current user">
            {admin?.user}
          </p>
        </div>
      </div>
      <div className=" container mx-auto mt-4 pt-2 w-11/12  border-t-2 border-[#7396ae] flex-1 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {articles?.map((article) => {
          return (
            <ArticleDetailes
              key={article?._id}
              id={article?._id}
              header={article?.header}
              thumbnail={article?.thumbnail}
              content={article?.content}
              like={article?.likes}
              view={article?.view}
              dislikes={article?.disLikes}
            />
          );
        })}
      </div>
      <ToastContainer />
    </section>
  );
}

export default AdminHomePage;
