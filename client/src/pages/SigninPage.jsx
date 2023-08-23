import React, { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { generateError, generatesuccess } from "../utility/Toasts";
import { ToastContainer } from "react-toastify";
import { BlogContext } from "../context/BlogContext";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function SigninPage() {
  const { setUser, setAccessToken } = useContext(BlogContext);
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
  const redirect = () => {
    history("/home");
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submit = (data) => {
    axios
      .post("http://localhost:3007/login", data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == 200) {
          setUser(jwtDecode(response.data.accessToken));
          setAccessToken(response.data.accessToken);
          generatesuccess("Successfully Logedin");
          redirect();
          reset();
        } else {
          generateError(response.data);
          reset();
        }
      });
  };

  return (
    <div className="container mx-auto flex flex-col justify-center gap-7 items-center min-h-screen">
      <h1 className=" font-semibold text-xl">Sign In</h1>
      <form
        onSubmit={handleSubmit(submit)}
        className=" container mx-auto w-4/5 sm:w-1/2 flex flex-col gap-2 justify-center xl:w-2/5"
      >
        <div className="w-full">
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
          <input
            type="email"
            placeholder="Email"
            className="bg-[#7395ae] w-full rounded-lg p-2 outline-none placeholder:text-[#5c5d61]"
            {...register("email")}
          />
        </div>
        <div className="w-full">
          {errors.password && (
            <span className="text-red-600">{errors.password.message}</span>
          )}
          <input
            type="password"
            placeholder="Password"
            className="bg-[#7395ae] w-full rounded-lg p-2 outline-none placeholder:text-[#5c5d61]"
            {...register("password")}
          />
        </div>
        <button
          type="submit"
          className="bg-[#7395ae] rounded-lg p-2 hover:text-[#557a95]"
        >
          Login
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default SigninPage;
