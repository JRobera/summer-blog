import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { ToastContainer } from "react-toastify";
import { BlogContext } from "../../context/BlogContext";
import jwt_decode from "jwt-decode";

function AdminLogin() {
  const { setAdmin, setAccessToken } = useContext(BlogContext);

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
    axios
      .post("http://localhost:3007/login/admin", data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == 200) {
          setAdmin(jwt_decode(response.data.accessToken));
          setAccessToken(response.data.accessToken);
          generatesuccess("Login successful");
          redirect();
        } else {
          generateError(response.data);
        }
      })
      .catch((err) => {
        generateError(err.response);
      });
  };

  return (
    <div className="w-full min-h-screen grid items-center">
      <form
        onSubmit={handleSubmit(submit)}
        className="container mx-auto w-4/5 sm:w-3/5 md:w-1/2 lg:w-3/5 xl:w-2/5 min-h-max flex flex-col justify-center gap-4 rounded-md bg-[#7395ae] shadow-md p-6"
      >
        <p className="w-1/3 mx-auto font-bold text-xs sm:text-lg">
          Admin login
        </p>

        <div className="relative">
          {errors.user && (
            <span className="text-red-600 text-xs absolute -top-4">
              {errors.user?.message}
            </span>
          )}
          <input
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#5c5d61]"
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
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#5c5d61] "
            type="text"
            placeholder="Enter password"
            {...register("password")}
          />
        </div>
        <button
          type="submit"
          className="bg-[#557a95] w-2/5 sm:w-1/5 mx-auto p-2 rounded-md font-bold text-xs sm:text-lg text-white hover:text-[#5c5d61] "
        >
          Log In
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
