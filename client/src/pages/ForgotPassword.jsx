import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { generateError, generatesuccess } from "../utility/Toasts";

function ForgotPassword() {
  const schema = yup.object().shape({
    email: yup
      .string("Email must be string")
      .email("Invalid email formate")
      .required("Email is required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submit = (data) => {
    axios
      .post("http://localhost:3007/forgot/password", data)
      .then((res) => {
        generatesuccess(res.data);
        reset();
      })
      .catch((errors) => {
        generateError(errors);
        reset();
      });
  };

  return (
    <div className="container mx-auto h-[100vh] ">
      <form
        className=" flex flex-col gap-4 w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 p-2 rounded-md relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
        onSubmit={handleSubmit(submit)}
      >
        <label htmlFor="" className="text-center font-semibold">
          Forgot password
        </label>
        <div className="relative">
          {errors.email && (
            <span className="text-red-600 text-xs absolute -top-4 pl-2">
              {errors.email.message}
            </span>
          )}
          <input
            type="text"
            placeholder="Enter email"
            className="w-full border-none outline-none h-10 bg-[#7395ae] placeholder:text-[#557a95] px-2 rounded-md"
            {...register("email")}
          />
        </div>
        <button
          type="submit"
          className="bg-[#7395ae] hover:text-[#557a95] rounded-md p-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
