import React, { useContext, useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import ReplyComment from "./ReplyComment";
import axios from "axios";
import { BlogContext } from "../context/BlogContext";

function Comment({ id, comment, author, likes }) {
  // const [showReply, setShowReply] = useState(false);
  // const [replys, setReplys] = useState();
  const [commentLike, setCommentLike] = useState(likes);
  const { user } = useContext(BlogContext);

  const handleCommentLike = () => {
    axios
      .post("https://summer-blog-api.onrender.comlike/comment", {
        id: id,
        userid: user?._id,
      })
      .then((res) => {
        if (res.data) {
          setCommentLike(commentLike + 1);
        } else {
          setCommentLike(commentLike - 1);
        }
        // console.log(res.data);
      });
  };

  useEffect(() => {
    axios
      .post("https://summer-blog-api.onrender.comget/reply", { commentid: id })
      .then((res) => {
        if (res) {
          console.log(res.data);
          // setReplys(res.data)
        }
      });
  }, []);

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
        <span
          className="flex gap-1 items-center hover:text-white/70 "
          onClick={handleCommentLike}
        >
          <BiLike size={24} />
          <sub>{commentLike}</sub>
        </span>

        {/* <button
          className="hover:text-[#557a95]"
          onClick={() => setShowReply(!showReply)}
        >
          Reply
        </button> */}
      </div>
      {/* {showReply && (
        <ReplyComment commentid={id} author={author} comment={comment} />
      )} */}
    </div>
  );
}

export default Comment;
