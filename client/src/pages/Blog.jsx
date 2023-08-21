import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.core.css";
import NavBar from "../component/nav_bar/NavBar";
import { generateError } from "../utility/Toasts";
import axios from "axios";

function Blog() {
  const [article, setArticle] = useState(null);
  const [iconColorLike, setIconColorLike] = useState("white");
  const [iconColorDislike, setIconColorDislike] = useState("white");

  const myarticle = useRef();
  const params = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3007/blog/${params.id}`).then((res) => {
      if (res.status == 200) {
        setArticle(res.data);
      } else {
        generateError(res.data);
        console.log(params.id);
      }
    });
  }, []);

  useEffect(() => {
    const element = myarticle.current;
    element.innerHTML = article?.content;
  }, [article]);

  const handleMouseOver = () => {
    setIconColor("#7396ae");
  };

  const handleMouseOut = () => {
    setIconColor("white");
  };

  return (
    <section className=" art p-2 min-h-full">
      <NavBar />
      <div className=" container w-11/12 mx-auto ql-editor min-h-full no-scrollbar">
        <img
          className=" w-11/12 mx-auto my-7 rounded-xl aspect-auto h-auto object-fill "
          src={article?.thumbnail}
          alt=""
        />
        <div className="text-sm  sm:text-[0.9rem] " ref={myarticle}></div>
        <div className="contaner mx-auto mt-10 flex gap-10 justify-center">
          <box-icon
            name="like"
            color={iconColorLike}
            onMouseOver={() => {
              setIconColorLike("#7396ae");
            }}
            onMouseLeave={() => {
              setIconColorLike("white");
            }}
          ></box-icon>

          <box-icon
            name="dislike"
            color={iconColorDislike}
            onMouseOver={() => {
              setIconColorDislike("#7396ae");
            }}
            onMouseLeave={() => {
              setIconColorDislike("white");
            }}
          ></box-icon>
        </div>
        {/* Add Comment  feature*/}
      </div>
    </section>
  );
}

export default Blog;
