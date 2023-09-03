import React, { useContext } from "react";
import { BsBookmarks } from "react-icons/bs";
import { AES, enc } from "crypto-js";
import { Link } from "react-router-dom";
import axios from "axios";
import { BlogContext } from "../../context/BlogContext";
import { generateError, generatesuccess } from "../../utility/Toasts";

function ArtPreview({ thumbnail, id, title, text, view, like, isLatest }) {
  const { user } = useContext(BlogContext);

  const clearHtmlTags = (data) => {
    return data?.replace(/<[^>]+>/g, "");
  };

  const handleBookMark = () => {
    axios
      .post("http://localhost:3007/add/bookmark", {
        articleid: id,
        id: user?._id,
      })
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
        } else {
          generateError(res.data);
        }
      });
  };

  return (
    <div
      className={
        isLatest == "true"
          ? "flex md:flex-row gap-8 flex-col items-center "
          : "flex gap-2 flex-col transition duration-500 "
      }
    >
      <div
        className={
          isLatest == "true"
            ? "w-full md:w-1/2 h-60 rounded-md flex flex-col bg-slate-600 overflow-hidden relative group"
            : " w-full h-60 lg:h-36 rounded-md flex flex-col bg-slate-600 overflow-hidden relative group"
        }
      >
        <span
          className="absolute top-2 right-2 z-20 text-[#7395ae] hover:text-[#557a95] text-md"
          title="Add to BookMark"
          onClick={handleBookMark}
        >
          <BsBookmarks size={21} />
        </span>
        <img
          className="w-full min-h-full group-hover:scale-105 duration-500 object-cover"
          src={thumbnail}
          alt="article image"
        />
        <div className="flex justify-center items-center text-center translate-y-3 duration-500 group-hover:-translate-y-full bg-gradient-to-t from-[#7396ae] to-transparent min-h-full">
          <span className=" flex-1">View {view}</span>
          <span className=" flex-1">Like {like}</span>
        </div>
      </div>

      <div
        className={
          isLatest == "true"
            ? "w-full md:w-1/2 flex flex-col justify-center"
            : ""
        }
      >
        <Link
          className="block"
          to={`/blog/${id}`}
          // href={`/blog/${AES.encrypt(id, import.meta.env.VITE_SECRET_KEY).toString()}`}
        >
          <h1
            className={
              isLatest == "true" ? "font-bold text-4xl mb-4" : "font-bold"
            }
          >
            {clearHtmlTags(title)}
          </h1>
        </Link>

        {isLatest == "true" ? (
          <p className=" line-clamp-3">{clearHtmlTags(text)}</p>
        ) : null}
      </div>
    </div>
  );
}

export default ArtPreview;
