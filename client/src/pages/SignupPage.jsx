import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { generateError, generatesuccess } from "../utility/Toasts";
import { BlogContext } from "../context/BlogContext";
import jwt_decode from "jwt-decode";

function SignupPage() {
  const { setUser, setAccessToken } = useContext(BlogContext);
  const schema = yup.object().shape({
    userName: yup.string().required("User name required"),
    email: yup
      .string("Must be string")
      .required("Email is required")
      .email("Invaid email"),
    password: yup
      .string()
      .required("Password required")
      .min(6, "Password must be more than 6 character")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%&_]).{6,}$/,
        "Password must containe a letter, a number, and a special character !@#$%&_"
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const history = useNavigate();

  const redirect = () => {
    history("/");
  };

  const submit = (data) => {
    axios
      .post("https://summer-blog-api.onrender.com/create/new-user", data, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status == 201) {
          // setUser(jwt_decode(res.data.accessToken));
          // setAccessToken(res.data.accessToken);
          generatesuccess(res.data);
          redirect();
          reset();
        } else {
          generateError(res.data);
          reset();
        }
      });
  };
  return (
    <div className=" w-full min-h-screen grid items-center">
      <form
        className="container mx-auto w-4/5 sm:w-3/5 md:w-2/5 xl:w-2/5 min-h-max flex flex-col justify-center gap-4 rounded-md bg-[#7395ae] shadow-md p-6"
        onSubmit={handleSubmit(submit)}
      >
        <h1 className=" w-1/3 mx-auto font-bold text-sm sm:text-base text-center">
          Signup
        </h1>

        <div className="flex flex-col relative">
          {errors.userName && (
            <span className="text-xs text-red-600 absolute -top-4 pl-2">
              {errors.userName.message}
            </span>
          )}
          <input
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#7395ae] "
            type="text"
            placeholder="Enter user name"
            {...register("userName")}
          />
        </div>
        <div className="flex flex-col relative">
          {errors.email && (
            <span className="text-xs text-red-600 absolute -top-4 pl-2">
              {errors.email.message}
            </span>
          )}
          <input
            className="p-2 rounded-md w-full outline-none bg-[#557a95] placeholder:text-[#7395ae] "
            type="email"
            placeholder="Enter email"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col relative">
          {errors.password && (
            <span className="text-xs text-red-600 absolute -top-4 pl-2">
              {errors.password.message}
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
          className="bg-[#557a95] w-2/5 sm:w-1/5 mx-auto p-2 rounded-md font-bold text-sm sm:text-base text-white hover:text-white/70 "
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
