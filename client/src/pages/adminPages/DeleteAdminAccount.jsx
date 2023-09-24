import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";

function DeleteAdminAccount() {
  const schema = yup.object().shape({
    user: yup.string().required("User name required"),
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
        axios
          .post("https://summer-blog-api.onrender.comdelete/account", data)
          .then((response) => {
            if (response.status == 200) {
              generatesuccess(response.data);
            } else {
              generateError(response.data);
            }
          })
          .catch((err) => {
            generateError(err.response.data);
          });
        console.log(data);
        reset();
      })}
      className=" container w-3/4 min-h-fit items-center justify-center sm:w-2/5 mx-auto p-4 flex flex-col gap-4"
    >
      <div className="relative w-full">
        {errors.user && (
          <span className="text-red-600 text-xs absolute -top-4">
            {errors.user.message}
          </span>
        )}
        <input
          className="w-full p-2 rounded-lg bg-[#7396ae] placeholder:text-[#5c5d61] outline-none"
          type="text"
          placeholder="Enter name"
          {...register("user")}
        />
      </div>

      <button
        className="bg-[#7396ae] p-2 rounded-lg hover:text-[#5c5d61] "
        type="submit"
      >
        Delete Account
      </button>
    </form>
  );
}

export default DeleteAdminAccount;
