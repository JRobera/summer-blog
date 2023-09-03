import React, { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { BlogContext } from "../../context/BlogContext";

function ChangePassword({ handleChangeClick }) {
  const { user } = useContext(BlogContext);

  const schema = yup.object().shape({
    currentPassword: yup.string().required("Current password required"),
    newPassword: yup
      .string()
      .required("New password required")
      .min(4, "Minimum length is four"),
    confirmPassword: yup
      .string()
      .required("Confirm password required")
      .oneOf([yup.ref("newPassword"), null], "Password does not match"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submit = (data) => {
    axios
      .post("http://localhost:3007/change-password", { id: user?._id, ...data })
      .then((res) => {
        handleChangeClick();
        generatesuccess(res.data);
        reset();
      })
      .catch((error) => {
        generateError(error);
      });
  };

  return (
    <div className="bg-black/50 z-30 min-h-[120vh] absolute top-0 left-0 w-[100vw]">
      <div className="bg-[#557a95] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 p-2 w-11/12 md:w-3/5 h-3/5 rounded-lg">
        <span
          onClick={handleChangeClick}
          className="absolute right-2 hover:text-[#7395ae]"
        >
          <AiOutlineClose size={20} />
        </span>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-2 mt-5 relative">
            <label htmlFor="password">Current password</label>

            {errors.currentPassword && (
              <span className="text-red-600 text-xs absolute top-4 ">
                {errors.currentPassword.message}
              </span>
            )}
            <input
              type="password"
              className="bg-[#7395ae] outline-none p-2 rounded-md placeholder:text-[#557a95]"
              placeholder="Enter current password"
              id="password"
              {...register("currentPassword")}
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="newP">New password</label>
            {errors.newPassword && (
              <span className="text-red-600 text-xs absolute top-4">
                {errors.newPassword.message}
              </span>
            )}
            <input
              type="password"
              className="bg-[#7395ae] outline-none p-2 rounded-md placeholder:text-[#557a95]"
              placeholder="Enter new password"
              id="newP"
              {...register("newPassword")}
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="confiP">Confirm password</label>
            {errors.confirmPassword && (
              <span className="text-red-600 text-xs absolute top-4">
                {errors.confirmPassword.message}
              </span>
            )}
            <input
              type="password"
              className="bg-[#7395ae] outline-none p-2 rounded-md placeholder:text-[#557a95]"
              placeholder="Confirm password"
              id="confiP"
              {...register("confirmPassword")}
            />
          </div>
          <button
            type="submit"
            className="text-center w-full mt-4 bg-[#7395ae] py-1 rounded-md hover:text-[#557a95]"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
