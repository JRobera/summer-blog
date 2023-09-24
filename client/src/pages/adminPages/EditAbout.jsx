import axios from "axios";
import React, { useState } from "react";
import { generateError, generatesuccess } from "../../utility/Toasts";

function EditAbout() {
  const [aboutText, setAboutText] = useState("");
  const [photo, setPhoto] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setSelectedFile(file.name);
  };

  const handleAboutChange = (e) => {
    const { value, name } = e.target;
    setAboutText(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    const fileExtention = photo.name.split(".")[1];
    setIsUploading(true);
    if (fileExtention !== "php") {
      formdata.append("profile", photo);
      formdata.append("text", aboutText);

      axios
        .post("https://summer-blog-api.onrender.comedit/about", formdata)
        .then((response) => {
          if (response.status == 200) {
            generatesuccess(response.data);
            setAboutText("");
            setSelectedFile("Select profile image");
            setIsUploading(false);
          } else {
            generateError(response.data);
            setSelectedFile("Select profile image");
            setIsUploading(false);
          }
        });
    } else {
      generateError("Invalid file formate!");
      setSelectedFile("Select profile image");
      setIsUploading(false);
    }
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
          {selectedFile ? selectedFile : "Select profile image"}
        </label>
        <input
          id="selectavatar"
          className="w-full h-full rounded-md"
          type="file"
          accept="image/png, image/jpeg, image/jpg "
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
      {!isUploading ? (
        <button
          type="submit"
          className="bg-[#7396ae] hover:text-[#5c5d61] mt-2 p-2 rounded-md flex gap-2 justify-center"
        >
          Update
        </button>
      ) : (
        <button
          type="submit"
          className="bg-[#7396ae] hover:text-[#5c5d61] mt-2 p-2 rounded-md flex gap-2 justify-center"
        >
          Updating
          <span className=" animate-spin inline-block w-5 h-5 rounded-full border-white border-solid border-2 border-x-transparent"></span>
        </button>
      )}
    </form>
  );
}

export default EditAbout;
