import React, { useState, useEffect, useContext } from "react";
import { TfiMore } from "react-icons/tfi";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";
import axios from "axios";
import { BlogContext } from "../../context/BlogContext";

function PublishedArticle() {
  const { user } = useContext(BlogContext);
  const [publishedArticles, setPublishedArticles] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3007/get/published-article", { u_id: user?._id })
      .then((res) => {
        if (res.status == 200) {
          setPublishedArticles(res.data);
        } else {
          console.log("error");
          generateError(res.data);
        }
      })
      .catch((error) => {
        generateError(error);
      });
  }, []);

  const handleDelete = (id) => {
    setPublishedArticles(
      publishedArticles?.filter((article) => {
        return article?._id !== id;
      })
    );
    axios
      .post("http://localhost:3007/delete/article", { id: id })
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
        }
      })
      .catch((err) => {
        generateError(err.message);
      });
  };

  const clearHtmlTags = (data) => {
    return data?.replace(/<[^>]+>/g, "");
  };
  const [showPopUp, setShowPopUp] = useState(false);

  const formattedDate = (createdAt) => {
    const postDate = new Date(createdAt);
    return postDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {publishedArticles?.map((article) => (
        <div
          className="relative px-5 py-4 mt-1 border-b-2  bg-[#7395ae]"
          key={article?._id}
        >
          <Link to={"/blog/" + `${article?._id}`}>
            <div className="flex gap-4 ">
              <div>
                <p>{formattedDate(article?.createdAt)}</p>
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
            {showPopUp && (
              <PopUp id={article?._id} handleDelete={handleDelete} />
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className=" w-3/4">
              <Link to={"/blog/" + `${article?._id}`}>
                <h1 className="font-semibold text-lg">{article?.header}</h1>
                <p className=" line-clamp-3">
                  {clearHtmlTags(article?.content)}
                </p>
              </Link>
            </div>

            <div className="w-full md:w-1/4 overflow-y-hidden max-h-32 ">
              <Link
                to={"/blog/" + `${article?._id}`}
                className=" w-full h-32 inline-block"
              >
                <img
                  className=" object-cover rounded-md w-full h-full"
                  src={article?.thumbnail}
                  alt="Article thumbnail"
                />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default PublishedArticle;
