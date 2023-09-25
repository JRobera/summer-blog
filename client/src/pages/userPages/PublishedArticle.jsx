import React, { useState } from "react";
import { TfiMore } from "react-icons/tfi";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";

function PublishedArticle({
  _id,
  header,
  thumbnail,
  content,
  createdAt,
  handleDelete,
}) {
  const clearHtmlTags = (data) => {
    return data?.replace(/<[^>]+>/g, "");
  };
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <>
      <div className="relative px-5 py-4 mt-1 border-b-2  bg-[#7395ae]">
        <Link to={"/blog/" + `${_id}`}>
          <div className="flex gap-4 ">
            <div>
              <p>{createdAt}</p>
            </div>
          </div>
        </Link>

        <div
          className="absolute right-2 top-2 hover:cursor-pointer"
          //   onClick={handleUnBookMark}
        >
          <TfiMore
            size={21}
            onClick={() => {
              setShowPopUp(!showPopUp);
            }}
          />
          {showPopUp && <PopUp id={_id} handleDelete={handleDelete} />}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className=" w-3/4">
            <Link to={"/blog/" + `${_id}`}>
              <h1 className="font-semibold text-lg">{header}</h1>
              <p className=" line-clamp-3">{clearHtmlTags(content)}</p>
            </Link>
          </div>

          <div className="w-full md:w-1/4 overflow-y-hidden max-h-32 ">
            <Link
              to={"/blog/" + `${_id}`}
              className=" w-full h-32 inline-block"
            >
              <img
                className=" object-cover rounded-md w-full h-full"
                src={thumbnail}
                alt="Article thumbnail"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PublishedArticle;
