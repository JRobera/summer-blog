import React, { useContext, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import { BlogContext } from "../../context/BlogContext";
import EditAbout from "./EditAbout";
import DeleteAdminAccount from "./DeleteAdminAccount";
import ChangePassword from "./ChangePassword";
import CreateNewAdmin from "./CreateNewAdmin";
import ArticleEditor from "./ArticleEditor";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AdminHomePage from "./AdminHomePage";

function AdminDashBoard() {
  const { setAdmin, setAccessToken, tab } = useContext(BlogContext);

  const refreshToken = () => {
    axios
      .post(
        "https://summer-blog-api.onrender.com/refresh-token",
        {},
        { withCredentials: true }
      )
      .then((response) => {
        setAdmin(jwtDecode(response.data?.accessToken));
        setAccessToken(response.data?.accessToken);
      });
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <section className="w-full min-h-screen flex">
      <AdminNavBar />
      {tab == 0 ? (
        <AdminHomePage />
      ) : tab == 1 ? (
        <ArticleEditor />
      ) : tab == 2 ? (
        <CreateNewAdmin />
      ) : tab == 3 ? (
        <ChangePassword />
      ) : tab == 4 ? (
        <DeleteAdminAccount />
      ) : tab == 5 ? (
        <EditAbout />
      ) : null}
    </section>
  );
}

export default AdminDashBoard;
