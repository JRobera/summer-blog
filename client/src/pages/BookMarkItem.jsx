import React from "react";
import { Link } from "react-router-dom";
import { BiBookmarkMinus } from "react-icons/bi";
import axios from "axios";
import { generateError, generatesuccess } from "../utility/Toasts";

function BookMarkItem({
  _id,
  userId,
  user,
  profile,
  header,
  thumbnail,
  content,
  createdAt,
  handleDelete,
}) {
  const clearHtmlTags = (data) => {
    return data?.replace(/<[^>]+>/g, "");
  };

  const postDate = new Date(createdAt);
  const formattedDate = postDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleUnBookMark = () => {
    axios
      .post("http://localhost:3007/add/bookmark", {
        articleid: _id,
        id: userId,
      })
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
          handleDelete(_id);
        } else {
          generateError(res.data);
        }
      });
  };

  return (
    <div className="relative px-5 py-4 rounded-md bg-[#7395ae]">
      <Link to={"/blog/" + `${_id}`}>
        <div className="flex gap-4 ">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={profile}
            alt="Author profile"
          />
          <div>
            <p>{user?.user}</p>
            <p>{formattedDate}</p>
          </div>
        </div>
      </Link>

      <div
        className="absolute right-2 top-2 hover:text-[#557a95]"
        onClick={handleUnBookMark}
      >
        <BiBookmarkMinus size={21} />
      </div>

      <div className="flex flex-col md:flex-row gap-10 ">
        <div className=" w-3/4">
          <Link to={"/blog/" + `${_id}`}>
            <h1 className="font-semibold text-lg">{header}</h1>
            <p className=" line-clamp-3">{clearHtmlTags(content)}</p>
          </Link>
        </div>

        <div className="w-full md:w-1/4 overflow-y-hidden max-h-28 ">
          <Link to={"/blog/" + `${_id}`}>
            <img
              className=" object-cover rounded-md w-full h-full"
              src={thumbnail}
              alt="Article thumbnail"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookMarkItem;
