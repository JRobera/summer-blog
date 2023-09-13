import axios from "axios";
import React, { useContext, useState } from "react";
import { BlogContext } from "../context/BlogContext";

function ReplyComment({ commentid, author, comment }) {
  const { user } = useContext(BlogContext);
  const [reply, setReply] = useState("");

  const handleReply = () => {
    axios
      .post("http://localhost:3007/add/comment/reply", {
        commentid: commentid,
        comment: comment,
        reply: reply,
        userid: user._id,
      })
      .then((res) => {});
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setReply(e.target.value);
  };

  return (
    <div className="flex gap-2 flex-col mt-1">
      <textarea
        value={reply}
        className="
                 focus:h-20 focus:w-full focus:rounded-md  focus:outline-none focus:bg-[#7395ae] focus:resize-none focus:p-2 focus:placeholder:text-[#557a95] focus:no-scrollbar
                 h-10 w-full rounded-md border-white border-[1px] outline-none bg-[#7395ae] resize-none p-2 placeholder:text-[#557a95] no-scrollbar"
        placeholder="Add reply"
        onChange={handleChange}
      ></textarea>{" "}
      <button
        className=" bg-[#557a95] w-fit self-end p-2 rounded-md hover:text-[#7395ae] "
        onClick={handleReply}
      >
        Post
      </button>
    </div>
  );
}

export default ReplyComment;
