import React from "react";
import { BiLike } from "react-icons/bi";

function Comment({ comment, author, likes }) {
  return (
    <div className="bg-[#7395ae] rounded-md p-2">
      <div className="flex gap-4">
        <img
          src={author?.profile}
          className=" max-w-[30px] max-h-[30px] rounded-full"
          alt="profile image"
        />
        <div className=" leading-5 text-sm">
          <p>{author?.user}</p>
          <p>5 month ago</p>
        </div>
      </div>

      <p className="text-sm">{comment}</p>
      <div className="flex justify-between mt-2">
        <span className="flex gap-1 items-center hover:text-[#557a95]">
          <BiLike size={24} />
          <sub>{likes}</sub>
        </span>

        <button className="hover:text-[#557a95]">Reply</button>
      </div>
    </div>
  );
}

export default Comment;
