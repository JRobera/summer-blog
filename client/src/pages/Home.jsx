import React, { useContext, useEffect, useState } from "react";
import { articles } from "../assets/articles";
import NavBar from "../component/nav_bar/NavBar";
import ArtPreview from "../component/ArticlePreview/ArtPreview";
import SearchArticle from "../component/SearchArticle";
import axios from "axios";
import { BlogContext } from "../context/BlogContext";

function Home() {
  const { articles, setArticles } = useContext(BlogContext);
  const [latestArticle, setLatestArticle] = useState();

  useEffect(() => {
    axios.get("http://localhost:3007/get/latest").then((response) => {
      if (response.status == 200) {
        setLatestArticle(response.data);
      }
    });
    axios.get("http://localhost:3007/get/articles").then((response) => {
      if (response.status == 200) {
        setArticles(response.data);
      }
    });
  }, []);

  return (
    <section id="home" className="w-full min-h-full p-2 relative">
      <NavBar />
      <SearchArticle articles={articles} />
      <div className="xl:w-4/5 container mx-auto mt-8 pt-6 border-t-[1px] border-t-[#7395ae]">
        <ArtPreview
          isLatest="true"
          id={latestArticle?._id}
          thumbnail={latestArticle?.thumbnail}
          title={latestArticle?.header}
          text={latestArticle?.content}
          view={latestArticle?.view}
          like={latestArticle?.likes}
        />
      </div>
      <div className="container mx-auto mt-8 border-t-[1px] border-t-[#7395ae] xl:w-4/5">
        <p className="my-2 text-sm text-gray-300 font-semibold">
          Recently writen
        </p>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {articles?.map((article, i) => {
            return (
              <ArtPreview
                key={i}
                isLatest="false"
                id={article?._id}
                thumbnail={article?.thumbnail}
                title={article?.header}
                text={article?.content}
                view={article?.view}
                like={article?.likes}
              />
            );
          })}
        </div>
      </div>

      <a
        href="#home"
        className="sticky bottom-0 left-full bg-[#7396ae] p-2 text-center rounded-md"
      >
        <box-icon name="up-arrow-alt" color="#fff"></box-icon>
      </a>
    </section>
  );
}

export default Home;
