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
    user: yup.string().required("User name required"),
    email: yup
      .string("Must be string")
      .required("Email is required")
      .email("Invaid email"),
    password: yup
      .string()
      .min(4, "Password must be more than 4 character")
      .required("Password required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const history = useNavigate();

  const redirect = () => {
    history("/home");
  };

  const submit = (data) => {
    axios
      .post("http://localhost:3007/create/new-user", data, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status == 201) {
          setUser(jwt_decode(res.data.accessToken));
          setAccessToken(res.data.accessToken);
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
    <div className=" container mx-auto min-h-[100vh] flex flex-col gap-7 justify-center items-center">
      <h1 className=" font-semibold text-xl">Signup</h1>
      <form
        className="w-11/12 mx-auto flex flex-col gap-2 sm:w-3/5 xl:w-2/5"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex flex-col">
          {errors.user && <span>{errors.user.message}</span>}
          <input
            className="bg-[#7395ae] w-full rounded-lg p-2 outline-none placeholder:text-[#5c5d61]"
            type="text"
            placeholder="Enter user name"
            {...register("user")}
          />
        </div>
        <div className="flex flex-col">
          {errors.email && <span>{errors.email.message}</span>}
          <input
            className="bg-[#7395ae] w-full rounded-lg p-2 outline-none placeholder:text-[#5c5d61]"
            type="email"
            placeholder="Enter email"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col">
          {errors.password && <span>{errors.password.message}</span>}
          <input
            className="bg-[#7395ae] w-full rounded-lg p-2 outline-none placeholder:text-[#5c5d61]"
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />
        </div>
        <button
          className="bg-[#7395ae] rounded-lg p-2 hover:text-[#557a95]"
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
