import { createContext, useState } from "react";

const BlogContext = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [tab, setTab] = useState("0");
  const [articles, setArticles] = useState(null);

  return (
    <BlogContext.Provider
      value={{
        user,
        setUser,
        admin,
        setAdmin,
        accessToken,
        setAccessToken,
        articles,
        setArticles,
        tab,
        setTab,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export { BlogContext };
export default Context;
