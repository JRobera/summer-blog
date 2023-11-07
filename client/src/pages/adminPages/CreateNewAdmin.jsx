import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";

function CreateNewAdmin() {
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    user: yup.string().required("User name required"),
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

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (data !== null) {
          setIsLoading(true);
          axios
            .post("https://summer-blog-api.onrender.com/new-admin", data)
            .then((response) => {
              if (response.status == 201) {
                generatesuccess(response.data);
                setIsLoading(false);
              } else {
                generateError(response.data);
                setIsLoading(false);
              }
            })
            .catch((err) => {
              generateError(response.data);
              setIsLoading(false);
            });
          reset();
        }
      })}
      className=" container w-3/4 min-h-fit items-center justify-center md:w-2/5 mx-auto p-4 flex flex-col gap-4"
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
      <div className="relative w-full">
        {errors.password && (
          <span className="text-red-600 text-xs absolute -top-4">
            {errors.password.message}
          </span>
        )}
        <input
          className="w-full p-2 rounded-lg bg-[#7396ae] placeholder:text-[#5c5d61] outline-none"
          type="password"
          placeholder="Enter password"
          {...register("password")}
        />
      </div>
      <button
        className="bg-[#7396ae] p-2 rounded-lg hover:text-[#5c5d61] hover:bg-[#7390ae] flex gap-4 items-center justify-center"
        type="submit"
      >
        Create Account
        {isLoading && (
          <span className="animate-spin inline-block w-4 h-4 rounded-full border-white border-solid border-2 border-x-transparent"></span>
        )}
      </button>
    </form>
  );
}

export default CreateNewAdmin;
