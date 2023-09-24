import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { generatesuccess } from "../utility/Toasts";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { BlogContext } from "../context/BlogContext";
import Comment from "../component/Comment";

function ArticleReaction({ id, likes, disLikes, comments, handleRefresh }) {
  const { user } = useContext(BlogContext);
  const [newComment, setNewComment] = useState("");
  // const [commentLikeCount, setCommentLikeCount] = useState(likes);
  // const [disLikeCount, setDisLikeCount] = useState(disLikes);
  // const [commentCount, setCommentCount] = useState(comments?.length);

  const [isFocused, setIsFocused] = useState(false);
  const [isVisiable, setIsVisiable] = useState(false);

  const payload = { id: id, userid: user?._id };

  // when the like button is clicked update the count rerender the component with handleRefresh
  const handleLike = () => {
    axios.post("http://localhost:3007/like", payload).then((res) => {
      if (res.data) {
        handleRefresh();
        // setLikeCount((likeCount) => likeCount + 1);
      } else {
        handleRefresh();
        // setLikeCount((likeCount) => likeCount - 1);
      }
    });
  };
  // when the dislike button is clicked update the count rerender the component with handleRefresh
  const handleDislike = () => {
    axios.post("http://localhost:3007/dislike", payload).then((res) => {
      if (res.data) {
        handleRefresh();
        // setDisLikeCount((disLikeCount) => disLikeCount + 1);
      } else {
        handleRefresh();
        // setDisLikeCount((disLikeCount) => disLikeCount - 1);
      }
    });
  };

  const commentPayload = { id: id, userid: user?._id, comment: newComment };
  const handleComment = () => {
    axios
      .post("http://localhost:3007/new-comment", commentPayload)
      .then((res) => {
        if (res.status == 201) {
          handleRefresh();
          generatesuccess(res.data);
          setNewComment("");
        }
      });
  };

  const handleCommentClick = () => {
    setIsVisiable(!isVisiable);
  };

  return (
    <div className="contaner mx-auto mt-10 flex gap-5 flex-col">
      <div className="flex gap-10 justify-center">
        <div
          className=" hover:text-white/70  flex gap-1 items-center text-sm"
          onClick={handleLike}
        >
          <BiLike size={24} />
          <sub>{likes}</sub>
        </div>
        <div
          className=" hover:text-white/70  flex gap-1 items-center text-sm"
          onClick={handleDislike}
        >
          <BiDislike size={24} />
          <sub>{disLikes}</sub>
        </div>
        <div
          className=" hover:text-white/70  flex gap-1 items-center text-sm"
          onClick={handleCommentClick}
        >
          <FaRegComment size={24} />
          <sub>{comments?.length}</sub>
        </div>
      </div>

      {isVisiable && (
        <div>
          <textarea
            value={newComment}
            className={
              isFocused
                ? "h-20 w-full rounded-md  outline-none bg-[#7395ae] resize-none p-2 placeholder:text-[#557a95] no-scrollbar"
                : " h-10 w-full rounded-md  outline-none bg-[#7395ae] resize-none p-2 placeholder:text-[#557a95] no-scrollbar"
            }
            placeholder="Write you though"
            onClick={() => setIsFocused(!isFocused)}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          ></textarea>
          <div className="text-right flex gap-2 justify-end">
            <button
              className=" hover:text-[#557a95] hover:bg-[#7395ae] p-1 rounded-md"
              onClick={() => {
                setNewComment("");
              }}
            >
              Cancel
            </button>
            <button
              className=" hover:text-[#557a95] hover:bg-[#7395ae] p-1 rounded-md"
              onClick={handleComment}
            >
              Comment
            </button>
          </div>
          {/* Comments */}
        </div>
      )}
      <p className=" pl-2 font-semibold">Comments</p>
      <div className=" overflow-y-scroll max-h-80 flex gap-2 flex-col p-2 no-scrollbar">
        {comments?.map((comment, i) => {
          return (
            <Comment
              key={i}
              id={comment?._id}
              comment={comment?.comment}
              author={comment?.commentAuthor}
              likes={comment?.likes?.length}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ArticleReaction;
