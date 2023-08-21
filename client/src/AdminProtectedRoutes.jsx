import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { BlogContext } from "./context/BlogContext";

async function Auth() {
  try {
    const response = await axios.post(
      "http://localhost:3007/refresh-token",
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
  const { setAdmin, setaccessToken } = useContext(BlogContext);

  useEffect(() => {
    async function fetchData() {
      const result = await Auth();
      setIsAuth(result);
    }
    try {
      axios
        .post(
          `http://localhost:3007/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setAdmin(jwt_decode(response.data?.accessToken));
          setaccessToken(response.data?.accessToken);
        });
    } catch (err) {
      generateError(err);
    }

    fetchData();
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>; // Replace with your preferred loading indicator
  }

  return isAuth ? <Outlet /> : <Navigate to="/login/admin/page" replace />;
}

export default AdminProtectedRoutes;
