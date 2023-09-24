import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiBookmarkMinus } from "react-icons/bi";
import axios from "axios";
import { generateError, generatesuccess } from "../utility/Toasts";
import { BlogContext } from "../context/BlogContext";

function BookMarkItem() {
  const { user } = useContext(BlogContext);
  const [bookMarks, setBookMarks] = useState(undefined);

  const clearHtmlTags = (data) => {
    return data?.replace(/<[^>]+>/g, "");
  };

  const formattedDate = (createdAt) => {
    const postDate = new Date(createdAt);
    return postDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleGetBookMarks = () => {
    axios
      .post("https://summer-blog-api.onrender.com/get/my/book-marks", {
        userId: user?._id,
      })
      .then((res) => {
        if (res.status == 200) {
          setBookMarks(res.data?.bookMarks);
        }
      })
      .catch((error) => {
        generateError(error);
      });
  };

  const handleDelete = (id) => {
    setBookMarks(
      bookMarks.filter((bookMark) => {
        return bookMark?._id !== id;
      })
    );
  };

  useEffect(() => {
    handleGetBookMarks();
  }, []);

  const handleUnBookMark = (_id) => {
    axios
      .post("https://summer-blog-api.onrender.com/add/bookmark", {
        articleid: _id,
        id: user?._id,
      })
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
          handleDelete(_id);
          setBookMarks(undefined);
        } else {
          generateError(res.data);
        }
      });
  };

  const bookMarkComponent =
    bookMarks == undefined ? (
      <p>No bookmark Yet</p>
    ) : (
      bookMarks.map((bookMark) => {
        return (
          <div
            className="relative px-5 py-4 rounded-md bg-[#7395ae]"
            key={bookMark?._id}
          >
            <Link to={"/blog/" + `${bookMark?._id}`}>
              <div className="flex gap-4 ">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={bookMark?.author?.profile}
                  alt="Author profile"
                />
                <div>
                  <p>{bookMark?.author?.user}</p>
                  <p>{formattedDate(bookMark?.createdAt)}</p>
                </div>
              </div>
            </Link>

            <div
              className="absolute right-2 top-2 hover:text-[#557a95]"
              onClick={() => {
                handleUnBookMark(bookMark?._id);
              }}
            >
              <BiBookmarkMinus size={21} />
            </div>

            <div className="flex flex-col md:flex-row gap-6 ">
              <div className=" w-3/4">
                <Link to={"/blog/" + `${bookMark?._id}`}>
                  <h1 className="font-semibold text-lg">{bookMark?.header}</h1>
                  <p className=" line-clamp-3">
                    {clearHtmlTags(bookMark?.content)}
                  </p>
                </Link>
              </div>

              <div className="w-full md:w-1/4 overflow-y-hidden max-h-28 ">
                <Link
                  to={"/blog/" + `${bookMark?._id}`}
                  className=" w-full h-28 inline-block"
                >
                  <img
                    className=" object-fill rounded-md w-full h-full"
                    src={bookMark?.thumbnail}
                    alt="Article thumbnail"
                  />
                </Link>
              </div>
            </div>
          </div>
        );
      })
    );

  return <>{bookMarkComponent} </>;
}

export default BookMarkItem;
