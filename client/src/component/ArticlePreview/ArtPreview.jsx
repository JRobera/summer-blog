import React from "react";
import { AES, enc } from "crypto-js";

function ArtPreview({ thumbnail, id, title, text, view, like, isLatest }) {
  const clearHtmlTags = (data) => {
    return data?.replace(/<[^>]+>/g, "");
  };

  return (
    <div
      className={
        isLatest == "true"
          ? "flex md:flex-row gap-8 flex-col items-center "
          : "flex gap-2 flex-col  transition duration-500 "
      }
    >
      <div
        className={
          isLatest == "true"
            ? "w-full md:w-1/2 h-60 rounded-md flex flex-col bg-slate-600 overflow-hidden group"
            : " w-full h-32 lg:h-36 rounded-md flex flex-col bg-slate-600 overflow-hidden group"
        }
      >
        <img
          className="w-full min-h-full group-hover:scale-105 duration-500"
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
        <a
          className="block"
          href={`/blog/${id}`}
          // href={`/blog/${AES.encrypt(id, import.meta.env.VITE_SECRET_KEY).toString()}`}
        >
          <h1
            className={
              isLatest == "true" ? "font-bold text-4xl mb-4" : "font-bold"
            }
          >
            {clearHtmlTags(title)}
          </h1>
        </a>

        {isLatest == "true" ? (
          <p className=" line-clamp-3">{clearHtmlTags(text)}</p>
        ) : null}
      </div>
    </div>
  );
}

export default ArtPreview;
