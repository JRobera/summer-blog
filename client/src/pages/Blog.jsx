import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.core.css";
import NavBar from "../component/nav_bar/NavBar";
import { generateError } from "../utility/Toasts";
import axios from "axios";
import { BlogContext } from "../context/BlogContext";
import ArticleReaction from "./ArticleReaction";
import Pay from "../component/Pay";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

function Blog() {
  const { user } = useContext(BlogContext);
  const [article, setArticle] = useState(null);
  const [donater, setDonater] = useState();
  const schema = yup.object().shape({
    firstName: yup.string("Must be string").required("First name is required"),
    lastName: yup.string("Must be string").required("Last name is required"),
    email: yup
      .string("Must be string")
      .required("Email is required")
      .email("Invaid email format"),
    amount: yup
      .number("Must be number")
      .typeError("Must be number")
      .min(3, "Amount must be greater than 3")
      .required("Amount is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submit = (data) => {
    console.log(data);
    setDonater(data);
  };

  const myarticle = useRef();
  const params = useParams();
  const { id } = params;

  const handleRefresh = () => {
    axios.get(`https://summer-blog-api.onrender.com/blog/${id}`).then((res) => {
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
          <div className="flex flex-col gap-2 relative">
            {errors.firstName && (
              <span className="text-xs text-red-600 absolute -top-4 pl-2">
                {errors.firstName.message}
              </span>
            )}
            <input
              type="text"
              name="firstName"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter first name"
              {...register("firstName")}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            {errors.lastName && (
              <span className="text-xs text-red-600 absolute -top-4 pl-2">
                {errors.lastName.message}
              </span>
            )}
            <input
              type="text"
              name="lastName"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter last name"
              {...register("lastName")}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            {errors.email && (
              <span className="text-xs text-red-600 absolute -top-4 pl-2">
                {errors.email.message}
              </span>
            )}
            <input
              type="email"
              name="email"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter email"
              {...register("email")}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            {errors.amount && (
              <span className="text-xs text-red-600 absolute -top-4 pl-2">
                {errors.amount.message}
              </span>
            )}
            <input
              type="number"
              name="amount"
              className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
              placeholder="Enter amount"
              {...register("amount")}
            />
          </div>
          {!donater?.firstName &&
          !donater?.lastName &&
          !donater?.email &&
          !donater?.amount ? (
            <button
              type="submit"
              className="bg-[#557a95] p-2 rounded-md w-fit hover:text-white/70 -translate-x-1/2 relative left-1/2"
              onClick={handleSubmit(submit)}
            >
              Donate Now
            </button>
          ) : (
            <Pay
              fname={donater?.firstName}
              lname={donater?.lastName}
              email={donater?.email}
              amount={donater?.amount}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Blog;
