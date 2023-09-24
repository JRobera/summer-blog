import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.core.css";
import NavBar from "../component/nav_bar/NavBar";
import { generateError } from "../utility/Toasts";
import axios from "axios";
import { BlogContext } from "../context/BlogContext";
import ArticleReaction from "./ArticleReaction";
import Pay from "../component/Pay";

function Blog() {
  const { user } = useContext(BlogContext);
  const [article, setArticle] = useState(null);
  const [donater, setDonater] = useState();

  const myarticle = useRef();
  const params = useParams();
  const { id } = params;

  const handleRefresh = () => {
    axios.get(`https://summer-blog-api.onrender.comblog/${id}`).then((res) => {
      if (res.status == 200) {
        setArticle(res.data);
      } else {
        generateError(res.data);
      }
    });
  };

  useEffect(() => {
    handleRefresh();
  }, [id]);

  useEffect(() => {
    const element = myarticle.current;
    element.innerHTML = article?.content;
  }, [article]);

  const postDate = new Date(article?.createdAt);
  const formattedDate = postDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setDonater({ ...donater, [name]: value });
    console.log(donater);
  };

  return (
    <section className=" art p-2 min-h-full">
      <NavBar />
      <div className=" container w-11/12 mx-auto ql-editor min-h-full no-scrollbar mb-4">
        <p className="text-center text-2xl md:text-3xl font-semibold">
          {article?.header}
        </p>
        <img
          className=" w-11/12 mx-auto my-7 rounded-xl aspect-auto h-auto object-fill "
          src={article?.thumbnail}
          alt=""
        />
        <div className="flex gap-2 mb-5">
          <img
            src={article?.author?.profile}
            className="w-10 max-h-10 rounded-full object-cover"
            alt=""
          />
          <div>
            <p>
              {article?.author?.user}
              {/* .<span>Follow</span> */}
            </p>
            <p>{formattedDate}</p>
          </div>
        </div>
        <div className="text-sm  sm:text-[0.9rem] " ref={myarticle}></div>
        <ArticleReaction
          id={id}
          likes={article?.likes.length}
          disLikes={article?.disLikes?.length}
          comments={article?.comments}
          handleRefresh={handleRefresh}
        />
      </div>

      {/* Donation section */}
      <div className="container mx-auto">
        <div className="flex flex-col gap-4 bg-[#7395ae] rounded p-4 w-4/5 md:w-1/2 mx-auto">
          <div className="flex flex-col gap-2">
            <label htmlFor="">First Name</label>
            <input
              type="text"
              name="fname"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter first name"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">Last Name</label>
            <input
              type="text"
              name="lname"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter last name"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter email"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">Amount</label>
            <input
              type="number"
              name="amount"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter amount"
              onChange={handleChange}
            />
          </div>

          <Pay
            fname={donater?.fname}
            lname={donater?.lname}
            email={donater?.email}
            amount={donater?.amount}
          />
        </div>
      </div>
    </section>
  );
}

export default Blog;
