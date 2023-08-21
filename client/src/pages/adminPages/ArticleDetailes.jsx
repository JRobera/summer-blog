import React, { useState } from "react";
import DeleteAlert from "./DeleteAlert";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";

function ArticleDetailes({
  id,
  header,
  thumbnail,
  content,
  like,
  view,
  dislikes,
}) {
  const [alertVisible, setalertVisible] = useState(false);
  const handleClose = () => {
    setalertVisible(!alertVisible);
  };

  const handleDeleteArticle = () => {
    axios
      .post("http://localhost:3007/delete/article", { id })
      .then((response) => {
        if (response.status == 200) {
          generatesuccess(response.data);
        } else {
          generateError(response.data);
        }
      });
  };

  return (
    <div className="bg-[#7396ae] rounded-lg h-max overflow-hidden relative">
      <div className="flex flex-col h-[150px] group overflow-hidden shadow-lg">
        <img className="min-h-[150px]" src={thumbnail} alt="" />
        <div className="text-center min-h-[150px] grid items-center group-hover:-translate-y-full duration-500 bg-gradient-to-t from-[#7396ae] to-transparent">
          <h1>{header}</h1>
          <div className="flex">
            <span
              className="flex-1 justify-center items-center cursor-pointer"
              onClick={() => {
                alert("edit");
              }}
              title="Edit Article"
            >
              <box-icon name="edit" color="white"></box-icon>
            </span>
            <span
              className="flex-1 justify-center items-center cursor-pointer"
              onClick={() => {
                setalertVisible(!alertVisible);
              }}
              title="Delete Article"
            >
              <box-icon name="x" color="white"></box-icon>
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
        <p className="flex-1">Like {like}</p>
        <p className="flex-1">View {view}</p>
        <p className="flex-1">Dislike {dislikes}</p>
      </div>
    </div>
  );
}

export default ArticleDetailes;
