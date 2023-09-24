import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "./context/BlogContext";
import { generateError } from "./utility/Toasts";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

async function Auth() {
  try {
    const response = await axios.post(
      "https://summer-blog-api.onrender.com/user-refresh-token",
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.accessToken ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function UserProtectedRoutes() {
  const [isAuth, setIsAuth] = useState(null);
  const { setUser, setAccessToken } = useContext(BlogContext);

  useEffect(() => {
    async function fetchData() {
      const result = await Auth();
      setIsAuth(result);
    }
    try {
      axios
        .post(
          `https://summer-blog-api.onrender.com/user-refresh-token`,
          {},
          { withCredentials: true }
        )
        .then((response) => {
          setUser(jwt_decode(response.data?.accessToken));
          setAccessToken(response.data?.accessToken);
        });
    } catch (error) {
      generateError(err);
    }
    fetchData();
  }, []);
  if (isAuth == null) {
    return (
      <div className=" mx-auto text-center flex items-center justify-center h-[100vh]">
        <span className=" border-x-2 border-y-2 border-y-transparent rounded-full animate-spin w-8 h-8 inline-block"></span>
      </div>
    );
  }
  return isAuth ? <Outlet /> : <Navigate to="/signin" replace />;
}

export default UserProtectedRoutes;
