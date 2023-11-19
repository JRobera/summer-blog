import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../utility/axios.js";
import { generateError, generatesuccess } from "../../utility/Toasts";

function DeleteAdminAccount() {
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);

        api
          .post("/delete/account", data)
          .then((response) => {
            if (response.status == 200) {
              generatesuccess(response.data);
              setIsLoading(false);
            } else {
              generateError(response.data);
              setIsLoading(false);
            }
          })
          .catch((err) => {
            generateError(err.response.data);
            setIsLoading(false);
          });
        // console.log(data);
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
        className="bg-[#7396ae] p-2 rounded-lg hover:text-[#5c5d61] flex gap-4 items-center justify-center"
        type="submit"
      >
        Delete Account
        {isLoading && (
          <span className="animate-spin inline-block w-4 h-4 rounded-full border-white border-solid border-2 border-x-transparent"></span>
        )}
      </button>
    </form>
  );
}

export default DeleteAdminAccount;
