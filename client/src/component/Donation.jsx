import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import Pay from "./Pay";

function Donation() {
  const schema = yup.object().shape({
    fname: yup
      .string("Input must be string")
      .required("First name is required"),
    lname: yup.string("Input must be string").required("Last name is required"),
    email: yup.string("Input must be string").required("Email is required"),
    amount: yup.number("Input must be a number").required("Amount is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-4 bg-[#7395ae] rounded p-4 w-4/5 md:w-1/2 mx-auto">
        <div className="flex flex-col gap-2">
          <label htmlFor="">First Name</label>
          <input
            type="text"
            name="fname"
            className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
            placeholder="Enter first name"
            onChange={handleChange}
            {...register("fname")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Last Name</label>
          <input
            type="text"
            name="lname"
            className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
            placeholder="Enter last name"
            onChange={handleChange}
            {...register("lname")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
            placeholder="Enter email"
            onChange={handleChange}
            {...register("email")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Amount</label>
          <input
            type="number"
            name="amount"
            className="bg-[#557a95] p-2 rounded-md placeholder:text-[#7395ae] outline-none"
            placeholder="Enter amount"
            onChange={handleChange}
            {...register("amount")}
          />
        </div>

        <Pay
          fname={donater?.fname}
          lname={donater?.lname}
          email={donater?.email}
          amount={donater?.amount}
        />
      </div>
    </div>
  );
}

export default Donation;
