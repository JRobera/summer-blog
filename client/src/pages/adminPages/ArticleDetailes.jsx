import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteAlert from "./DeleteAlert";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { Link } from "react-router-dom";

function ArticleDetailes({
  id,
  header,
  thumbnail,
  content,
  like,
  view,
  dislikes,
  getAllArticles,
}) {
  const [alertVisible, setalertVisible] = useState(false);
  const handleClose = () => {
    setalertVisible(!alertVisible);
  };

  const handleDeleteArticle = () => {
    axios
      .post("https://summer-blog-api.onrender.com/delete/article", { id })
      .then((response) => {
        if (response.status == 200) {
          generatesuccess(response.data);
          getAllArticles();
        } else {
          generateError(response.data);
        }
      });
  };

  return (
    <div className="bg-[#7396ae] rounded-lg h-max overflow-hidden relative">
      <div className="flex flex-col h-[150px] group overflow-hidden shadow-lg">
        <img className="min-h-[150px] object-cover" src={thumbnail} alt="" />
        <div className="text-center min-h-[150px] grid items-center justify-center group-hover:-translate-y-full duration-500 bg-gradient-to-t from-[#7396ae] to-transparent">
          <h1>{header}</h1>
          <div className="flex gap-5 justify-center">
            <Link
              to={`/update/article/${id}`}
              className="justify-center items-center cursor-pointer"
              title="Edit Article"
            >
              <BiEdit size={24} />
            </Link>
            <span
              className="justify-center items-center cursor-pointer"
              onClick={() => {
                setalertVisible(!alertVisible);
              }}
              title="Delete Article"
            >
              <AiOutlineDelete size={24} />
            </span>
          </div>
        </div>
      </div>
      {alertVisible && (
        <DeleteAlert
          handleClose={handleClose}
          handleDeleteArticle={handleDeleteArticle}
        />
      )}
      <div className="flex gap-4 justify-center p-2 text-center">
        <p className="flex-1 break-all">Like {like}</p>
        <p className="flex-1 break-all">View {view}</p>
        <p className="flex-1 break-all">Dislike {dislikes}</p>
      </div>
    </div>
  );
}

export default ArticleDetailes;
