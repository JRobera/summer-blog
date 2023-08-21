import axios from "axios";
import React, { useState } from "react";
import { generateError, generatesuccess } from "../../utility/Toasts";

function EditAbout() {
  const [aboutText, setAboutText] = useState("");
  const [photo, setPhoto] = useState("");

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleAboutChange = (e) => {
    const { value, name } = e.target;
    setAboutText(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("profile", photo);
    formdata.append("text", aboutText);

    axios
      .post("http://localhost:3007/edit/about", formdata)
      .then((response) => {
        if (response.status == 200) {
          generatesuccess(response.data);
          setAboutText("");
        } else {
          generateError(response.data);
        }
      });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto flex flex-col xl:w-3/5"
    >
      <p className="mt-20 font-bold text-xl">Update About Us</p>
      <div className=" relative my-2 ">
        <label
          htmlFor="selectavatar"
          className="absolute bg-[#7396ae] w-full h-full p-1 font-semibold hover:text-[#5c5d61] text-center rounded-md "
        >
          Select profile image
        </label>
        <input
          id="selectavatar"
          className="w-full h-full rounded-md"
          type="file"
          accept="image/*"
          onChange={handleProfileChange}
        />
      </div>
      <textarea
        className="bg-[#7396ae] resize-none rounded-md p-2 outline-none placeholder:text-[#5c5d61]"
        name="about"
        cols="30"
        rows="10"
        value={aboutText}
        placeholder="Write about your self"
        onChange={handleAboutChange}
      ></textarea>
      <button
        type="submit"
        className="bg-[#7396ae] hover:text-[#5c5d61] mt-2 p-2 rounded-md "
      >
        Update
      </button>
    </form>
  );
}

export default EditAbout;
