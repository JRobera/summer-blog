import React, { useEffect, useState } from "react";
import { BlogContext } from "../context/BlogContext";

function SearchArticle({ articles }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(articles);

  // const { articles } = useEffect(BlogContext);

  const search = () => {
    if (query !== "") {
      const results = articles.filter((article) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (query !== "") console.log(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center my-6 relative">
      <input
        type="search"
        placeholder="Search"
        className=" w-3/4 sm:w-2/5 p-2 outline-none rounded-full bg-[#7396ae] placeholder:text-[#5d5c61] "
        name=""
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />

      <div className="absolute flex overflow-hidden flex-col justify-center w-3/5 sm:w-1/3 top-10 rounded-b-lg">
        {result?.map((result, i) => {
          return (
            <div
              key={i}
              className="flex gap-2 p-2 items-center bg-[#7396ae] hover:bg-[#769db8]"
            >
              <a
                href={`/blog/${result._id}`}
                className="flex gap-2 items-center"
              >
                <img className="w-10" src={result?.thumbnail} alt="" />
                <p>{result?.header}</p>
              </a>
            </div>
          );
        })}
      </div>
    </form>
  );
}

export default SearchArticle;
