import React, { useState } from "react";
import NavBar from "../component/nav_bar/NavBar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { generateError, generatesuccess } from "../utility/Toasts";

function Contact() {
  const [isSending, setIsSending] = useState(false);

  const schema = yup.object().shape({
    fullName: yup.string("Name must be string").required("Name required"),
    email: yup
      .string("Email must be string")
      .required("Email is required")
      .email("Invalid email"),
    mobileNumber: yup
      .string("")
      .min(10, "Mobile number can not be less than ten!")
      .max(10, "Mobile number can not be grater than ten!"),
    subject: yup.string("Must be string").required("Subject is required"),
    yourMessage: yup.string("Must be string").required("Message is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submit = (data) => {
    setIsSending(true);
    axios
      .post("http://localhost:3007/api/send-message", data)
      .then((response) => {
        if (response.status == 200) {
          generatesuccess(response.data);
          setIsSending(false);
          reset();
        } else {
          generateError("Sorry! something went wrong!");
          setIsSending(false);
        }
      })
      .catch((err) => {
        generateError(err);
      });
  };

  return (
    <section className="p-2 min-h-screen">
      <NavBar />
      <p className="w-3/5 mx-auto my-4 font-bold text-xl">Contact Me</p>
      <form
        className="container mx-auto flex flex-col gap-4 w-3/4 rounded-lg"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex gap-4 flex-1 flex-col md:flex-row">
          <div className=" flex-grow relative">
            {errors.fullName && (
              <span className="text-red-600 text-xs absolute -top-4">
                {errors?.fullName?.message}
              </span>
            )}
            <input
              className="w-full p-4 rounded-lg outline-none bg-[#7395ae] placeholder:text-[#5d5c61]"
              type="text"
              placeholder="Full Name"
              {...register("fullName")}
            />
          </div>
          <div className=" flex-grow relative">
            {errors.email && (
              <span className="text-red-600 text-xs absolute -top-4">
                {errors?.email?.message}
              </span>
            )}
            <input
              className="w-full p-4 rounded-lg outline-none bg-[#7395ae] placeholder:text-[#5d5c61]"
              type="email"
              placeholder="Email Address"
              {...register("email")}
            />
          </div>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-grow relative">
            {errors.mobileNumber && (
              <span className="text-red-600 text-xs absolute -top-4">
                {errors?.mobileNumber?.message}
              </span>
            )}
            <input
              className="w-full p-4 rounded-lg outline-none bg-[#7395ae] placeholder:text-[#5d5c61]"
              type="text"
              placeholder="Mobile Number"
              {...register("mobileNumber")}
            />
          </div>
          <div className="flex-grow relative">
            {errors.subject && (
              <span className="text-red-600 text-xs absolute -top-4">
                {errors?.subject?.message}
              </span>
            )}
            <input
              className="w-full p-4 rounded-lg outline-none bg-[#7395ae] placeholder:text-[#5d5c61]"
              type="text"
              placeholder="Email Subject"
              {...register("subject")}
            />
          </div>
        </div>
        <div className="flex-grow relative">
          {errors.yourMessage && (
            <span className="text-red-600 text-xs absolute -top-4">
              {errors?.yourMessage?.message}
            </span>
          )}
          <textarea
            className="w-full p-4 rounded-lg outline-none resize-none bg-[#7395ae] placeholder:text-[#5d5c61]"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Your Message"
            {...register("yourMessage")}
          ></textarea>
        </div>
        <button
          type="submit"
          className="p-2 rounded-lg bg-[#7395ae] w-1/2 md:w-2/5 hover:text-[#557a95] mx-auto text-sm font-semibold"
        >
          {isSending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}

export default Contact;
