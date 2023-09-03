import React, { useEffect, useState } from "react";
import { BlogContext } from "../context/BlogContext";
import { Link } from "react-router-dom";

function SearchArticle({ articles, isvisiable }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(articles);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // const { articles } = useEffect(BlogContext);

  const search = () => {
    if (query !== "") {
      const results = articles?.filter((article) => {
        return (
          article.header.toLowerCase().startsWith(query.toLowerCase()) ||
          article?.content.toLowerCase().startsWith(query.toLowerCase())
        );
      });
      setResult(results);
    } else {
      setResult();
    }
  };
  useEffect(() => {
    search();
  }, [query]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });
  }, [screenWidth]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isvisiable && screenWidth < 640
          ? "flex absolute top-14 left-0 container mx-auto"
          : " hidden sm:flex sm:flex-1 sm:relative"
      }
    >
      <input
        type="search"
        placeholder="Search"
        className={
          isvisiable && screenWidth < 640
            ? "bg-[#7395ae] w-4/5 md:w-3/5 lg:w-1/2 p-2 mx-auto outline-none rounded-full placeholder:text-[#557a95] "
            : " w-4/5 md:w-3/5 lg:w-1/2 p-2 outline-none rounded-full bg-[#557a95] placeholder:text-[#7395ae] "
        }
        name=""
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />

      <div className="no-scrollbar bg-[#557a95] md:left-0 md:translate-x-0 container mx-auto absolute left-1/2 -translate-x-1/2 flex overflow-scroll flex-col justify-center top-11 w-4/5  md:w-3/5 lg:w-1/2 max-h-64 rounded-b-lg shadow-md shadow-black/30">
        {result?.map((result, i) => {
          return (
            <div
              key={i}
              className="flex gap-2 p-2 items-center bg-[#557a95] hover:bg-[#769db8] mt-5"
            >
              <Link
                to={`/blog/${result._id}`}
                className="flex gap-2 items-center"
                onClick={() => {
                  setResult();
                }}
              >
                <img
                  className=" max-w-[40px] max-h-10"
                  src={result?.thumbnail}
                  alt=""
                />
                <p>{result?.header}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </form>
  );
}

export default SearchArticle;
