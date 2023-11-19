import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { BlogContext } from "./context/BlogContext";
import api from "./utility/axios.js";

async function Auth() {
  try {
    const response = await api.post(
      "/refresh-token",
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

function AdminProtectedRoutes() {
  const [isAuth, setIsAuth] = useState(null);
  const { setAdmin, setAccessToken } = useContext(BlogContext);

  useEffect(() => {
    async function fetchData() {
      const result = await Auth();
      setIsAuth(result);
    }
    try {
      api
        .post(
          `/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setAdmin(jwt_decode(response.data?.accessToken));
          setAccessToken(response.data?.accessToken);
        });
    } catch (err) {
      generateError(err);
    }

    fetchData();
  }, []);

  if (isAuth === null) {
    return (
      <div className=" mx-auto text-center flex items-center justify-center h-[100vh]">
        <span className=" border-x-2 border-y-2 border-y-transparent rounded-full animate-spin w-8 h-8 inline-block"></span>
      </div>
    ); // Replace with your preferred loading indicator
  }

  return isAuth ? <Outlet /> : <Navigate to="/login/admin/page" replace />;
}

export default AdminProtectedRoutes;
