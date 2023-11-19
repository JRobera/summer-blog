import React, { useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import api from "../utility/axios.js";
import { generateError, generatesuccess } from "../utility/Toasts";
import { BlogContext } from "../context/BlogContext";
import jwtDecode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

function SigninPage() {
  const { setUser, accessToken, setAccessToken } = useContext(BlogContext);
  const [attemptCount, setAttempteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string("Email must be string")
      .required("Email is required")
      .email("Invalid email formate"),
    password: yup
      .string("Password must be string")
      .required("Password is required"),
  });

  const history = useNavigate();
  const redirect = (route) => {
    history(route);
  };

  useEffect(() => {
    if (accessToken) {
      redirect("/home");
    } else {
      redirect("/signin");
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submit = (data) => {
    if (attemptCount < 3) {
      setIsLoading(true);
      api
        .post("/login", data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status == 200) {
            setUser(jwtDecode(response.data.accessToken));
            setAccessToken(response.data.accessToken);
            generatesuccess("Successfully Logged in");
            redirect("/home");
            reset();
            setAttempteCount(attemptCount + 1);
            setIsLoading(false);
          } else {
            generateError(response.data);
            reset();
            setAttempteCount(attemptCount + 1);
            setIsLoading(false);
          }
        });
    } else {
      generateError("Maximum attempt reached try again later");
      setInterval(() => {
        setAttempteCount(0);
      }, 1000 * 30);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid items-center">
      <form
        onSubmit={handleSubmit(submit)}
        className=" container mx-auto w-4/5 sm:w-3/5 md:w-2/5 xl:w-2/5 min-h-max flex flex-col justify-center gap-4 rounded-md bg-[#7395ae] shadow-md p-6"
      >
        <h1 className="w-1/3 mx-auto font-bold text-sm sm:text-base text-center">
          Sign In
        </h1>
        <div className="w-full relative">
          {errors.email && (
            <span className="text-xs text-red-600 absolute -top-4 pl-2">
              {errors.email.message}
            </span>
          )}
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#7395ae] "
            {...register("email")}
          />
        </div>
        <div className="w-full relative">
          {errors.password && (
            <span className="text-xs text-red-600 absolute -top-4 pl-2">
              {errors.password.message}
            </span>
          )}
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#7395ae] "
            {...register("password")}
          />
        </div>
        <button
          type="submit"
          className="bg-[#557a95] w-2/5 sm:w-1/3 mx-auto p-2 rounded-md font-bold text-sm sm:text-base text-white hover:text-white/70 flex gap-4 items-center justify-center"
        >
          Login
          {isLoading && (
            <span className="animate-spin inline-block w-4 h-4 rounded-full border-white border-solid border-2 border-x-transparent"></span>
          )}
        </button>
        <Link to={"/forgot-password"} className="forgot-link underline text-sm">
          Forgot Password
        </Link>
      </form>
    </div>
  );
}

export default SigninPage;
