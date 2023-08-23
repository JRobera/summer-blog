import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

function ForgotePassword() {
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
  return (
    <form className=" flex flex-col gap-2">
      <label htmlFor="">Forgot password</label>
      <div>
        {errors.email && <span>{errors.email.message}</span>}
        <input type="text" placeholder="Enter email" {...register("email")} />
      </div>
      <button type="submit">Send</button>
    </form>
  );
}

export default ForgotePassword;
