import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { generateError, generatesuccess } from "../utility/Toasts";

function ResetPassword() {
  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .max(20, "Max length is 20")
      .min(4, "Min length is 4")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Password must match")
      .required("Confirm Password is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const param = useParams();
  const { id, token } = param;

  const [newPassword, setNewPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const submit = (data) => {
    axios
      .post(`http://localhost:3007/reset-password/${token}/${id}`, data)
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
          reset();
        } else {
          generateError(res.data);
          reset();
        }
      })
      .catch((error) => {
        if (error.response.status == 403) {
          generateError(error.data);
        }
      });
  };

  return (
    <div className="container mx-auto h-[100vh] ">
      <form
        onSubmit={handleSubmit(submit)}
        className=" flex flex-col gap-4 w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 p-2 rounded-md relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
      >
        <label htmlFor="" className="text-center font-semibold">
          Reset password
        </label>
        <div className=" relative">
          {errors.newPassword && (
            <span className="text-xs text-red-600 absolute -top-4 pl-2">
              {errors.newPassword.message}
            </span>
          )}
          <input
            className=" w-full border-none outline-none h-10 bg-[#7395ae] placeholder:text-[#557a95] px-2 rounded-md"
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            {...register("newPassword")}
          />
        </div>
        <div className="relative">
          {errors.confirmPassword && (
            <span className="text-xs text-red-600 absolute -top-4 pl-2">
              {errors.confirmPassword.message}
            </span>
          )}
          <input
            className="w-full border-none outline-none h-10 bg-[#7395ae] placeholder:text-[#557a95] px-2 rounded-md"
            type="password"
            name="confirmPassword"
            placeholder="Enter confirm password"
            {...register("confirmPassword")}
          />
        </div>
        <button
          type="submit"
          className="bg-[#7395ae] hover:text-[#557a95] rounded-md p-2"
        >
          Reset
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
