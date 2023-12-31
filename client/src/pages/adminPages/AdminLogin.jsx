import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utility/axios.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { BlogContext } from "../../context/BlogContext";
import jwt_decode from "jwt-decode";

function AdminLogin() {
  const { setAdmin, setAccessToken } = useContext(BlogContext);
  const [isLoading, setIsLoading] = useState(false);

  let history = useNavigate();

  const redirect = () => {
    history("/admin/page/main/dashboard");
  };

  const schema = yup.object().shape({
    user: yup.string("").required("User name required"),
    password: yup.string("").required("Password required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submit = (data) => {
    setIsLoading(true);
    api
      .post("/login/admin", data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == 200) {
          setAdmin(jwt_decode(response.data.accessToken));
          setAccessToken(response.data.accessToken);
          generatesuccess("Login successful");
          redirect();
          reset();
          setIsLoading(false);
        } else {
          generateError(response.data);
          reset();
          setIsLoading(false);
        }
      })
      .catch((err) => {
        generateError(err.response);
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full min-h-screen grid items-center">
      <form
        onSubmit={handleSubmit(submit)}
        className="container mx-auto w-4/5 sm:w-3/5 md:w-1/2 xl:w-2/5 min-h-max flex flex-col justify-center gap-4 rounded-md bg-[#7395ae] shadow-md p-6"
      >
        <p className="w-1/3 mx-auto font-bold text-xs sm:text-lg text-center">
          Admin login
        </p>

        <div className="relative">
          {errors.user && (
            <span className="text-red-600 text-xs absolute -top-4">
              {errors.user?.message}
            </span>
          )}
          <input
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#7395ae]"
            type="text"
            placeholder="Enter user name"
            {...register("user")}
          />
        </div>
        <div className="relative">
          {errors.password && (
            <span className="text-red-600 text-xs absolute -top-4">
              {errors.password?.message}
            </span>
          )}
          <input
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#7395ae] "
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />
        </div>
        <button
          type="submit"
          className="bg-[#557a95] w-2/5 sm:w-1/5 mx-auto p-2 rounded-md font-bold text-xs sm:text-lg text-white hover:text-[#7395ae] flex gap-4 items-center justify-center"
        >
          Login
          {isLoading && (
            <span className="animate-spin inline-block w-4 h-4 rounded-full border-white border-solid border-2 border-x-transparent"></span>
          )}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
