import React, { useContext, useState } from "react";
import { AES } from "crypto-js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../utility/axios.js";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { BlogContext } from "../../context/BlogContext";

function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { admin } = useContext(BlogContext);

  const schema = yup.object().shape({
    oldPassword: yup.string().required("Old password required"),
    newPassword: yup
      .string()
      .required("Password required")
      .min(4, "Password must be grater than four")
      .max(20, ""),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Password does not match")
      .required("Password required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const { user } = admin;
        setIsLoading(true);
        api
          .post(
            `/update/password/${AES.encrypt(
              user,
              import.meta.env.VITE_SECRET_KEY
            )}`,
            data
          )
          .then((response) => {
            if (response.status == 200) {
              generatesuccess(response.data);
              setIsLoading(false);
            } else {
              generateError(response.data);
              setIsLoading(false);
            }
          });
        reset();
      })}
      className=" container w-3/4 min-h-fit items-center justify-center md:w-2/5 mx-auto p-4 flex flex-col gap-4"
    >
      <div className="relative w-full">
        {errors.oldPassword && (
          <span className="text-red-600 text-xs absolute -top-4">
            {errors.oldPassword.message}
          </span>
        )}
        <input
          className="w-full p-2 rounded-lg bg-[#7396ae] placeholder:text-[#5c5d61] outline-none"
          type="password"
          placeholder="Enter old password"
          {...register("oldPassword")}
        />
      </div>
      <div className="relative w-full">
        {errors.newPassword && (
          <span className="text-red-600 text-xs absolute -top-4">
            {errors.newPassword.message}
          </span>
        )}
        <input
          className="w-full p-2 rounded-lg bg-[#7396ae] placeholder:text-[#5c5d61] outline-none"
          type="password"
          placeholder="Enter new password"
          {...register("newPassword")}
        />
      </div>
      <div className="relative w-full">
        {errors.confirmPassword && (
          <span className="text-red-600 text-xs absolute -top-4">
            {errors.confirmPassword.message}
          </span>
        )}
        <input
          className="w-full p-2 rounded-lg bg-[#7396ae] placeholder:text-[#5c5d61]  outline-none"
          type="password"
          placeholder="Enter confirm password"
          {...register("confirmPassword")}
        />
      </div>
      <button
        className="bg-[#7396ae] p-2 rounded-lg hover:text-[#5c5d61] flex gap-4 items-center justify-center"
        type="submit"
      >
        Update password
        {isLoading && (
          <span className="animate-spin inline-block w-4 h-4 rounded-full border-white border-solid border-2 border-x-transparent"></span>
        )}
      </button>
    </form>
  );
}

export default ChangePassword;
