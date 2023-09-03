import React from "react";
import { TfiMore } from "react-icons/tfi";
import { Link } from "react-router-dom";

function PublishedArticle({ _id, header, thumbnail, content, createdAt }) {
  const clearHtmlTags = (data) => {
    return data?.replace(/<[^>]+>/g, "");
  };

  const postDate = new Date(createdAt);
  const formattedDate = postDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative px-5 py-4 rounded-md bg-[#7395ae]">
      <Link to={"/blog/" + `${_id}`}>
        <div className="flex gap-4 ">
          <div>
            <p>{formattedDate}</p>
          </div>
        </div>
      </Link>

      <div
        className="absolute right-2 top-2 hover:text-[#557a95]"
        //   onClick={handleUnBookMark}
      >
        <TfiMore size={21} />
      </div>

      <div className="flex gap-10">
        <div className=" w-3/4">
          <Link to={"/blog/" + `${_id}`}>
            <h1 className="font-semibold text-lg">{header}</h1>
            <p className=" line-clamp-3">{clearHtmlTags(content)}</p>
          </Link>
        </div>

        <div className=" w-1/4 overflow-y-hidden max-h-28 ">
          <Link to={"/blog/" + `${_id}`}>
            <img
              className=" object-cover"
              src={thumbnail}
              alt="Article thumbnail"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PublishedArticle;
