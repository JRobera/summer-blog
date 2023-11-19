import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../assets/reactQuill";
import api from "../utility/axios.js";
import { generateError, generatesuccess } from "../utility/Toasts";
import { BlogContext } from "../context/BlogContext";
import NavBar from "../component/nav_bar/NavBar";
import { useNavigate } from "react-router-dom";

function WriteArticle() {
  const { user } = useContext(BlogContext);
  const [isPublishing, setIsPublishing] = useState(false);
  const [value, setValue] = useState("");
  const [header, setHeader] = useState("");
  const [thumbnail, setThumbnail] = useState();
  const [selectedFile, setSelectedFile] = useState("");
  const [tag, setTag] = useState("Choose Tag here");
  const navigate = useNavigate();

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setSelectedFile(file.name);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    const fileExtention = thumbnail?.name.split(".")[1];

    if (fileExtention !== "php") {
      formData.append("id", user?._id);
      formData.append("header", header);
      formData.append("thumbnail", thumbnail);
      formData.append("tag", tag);
      formData.append("article", value);
      setIsPublishing(true);
      if (header !== "" && value !== "" && thumbnail !== "" && tag !== "") {
        api.post("/publish/article", formData).then((response) => {
          if (response.status == 200) {
            generatesuccess(response.data);
            setHeader("");
            setValue("");
            setIsPublishing(false);
            setSelectedFile("Select profile image");
            setTag("Choose Tag here");
            navigate("/home");
          } else {
            setIsPublishing(false);
            generateError(response.data);
            setSelectedFile("Select profile image");
            setTag("Choose Tag here");
          }
        });
      } else {
        setIsPublishing(false);
        generateError("All inputs are required!");
      }
    } else {
      setIsPublishing(false);
      generateError("Invalid file formate!");
      setSelectedFile("Select profile image");
      setTag("Choose Tag here");
    }
  };

  return (
    <div className=" flex-1 h-screen overflow-y-scroll p-2 relative">
      <NavBar />
      <div className="flex flex-col gap-2 mt-5">
        <textarea
          name=""
          id=""
          value={header}
          placeholder="Header"
          className="md:text-4xl text-lg font-semibold md:h-16 h-12 max-w-[1024px] w-4/5 mx-auto p-2 bg-[#7395ae] placeholder:text-[#557a95] border-2 border-[#5d5c61] outline-none resize-none rounded-lg "
          onChange={(e) => {
            setHeader(e.target.value);
          }}
        ></textarea>
        <div className=" flex gap-2 flex-col w-4/5 sm:w-3/5 mx-auto sm:flex-row justify-center mb-2 relative">
          <div className="relative">
            <label
              className=" absolute bg-[#7395ae] w-full h-full text-center hover:text-white/70 font-semibold p-1 rounded-md cursor-pointer"
              htmlFor="thumbnail"
            >
              {selectedFile ? selectedFile : "Select Thumbnail Image"}
            </label>
            <input
              className=" text-center rounded-md"
              id="thumbnail"
              type="file"
              accept="image/png, image/jpeg, image/jpg "
              onChange={handleThumbnail}
            />
          </div>
          <select
            className="hover:text-white/70 bg-[#7395ae] outline-none rounded-md text-center p-2"
            onChange={(e) => {
              setTag(e.target.value);
            }}
            defaultValue={tag}
          >
            <option value={tag} disabled hidden>
              Choose Tag here
            </option>

            <option value="Web development">Web development</option>
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Fashion and Style">Fashion and Style</option>
            <option value="Arts and Crafts">Arts and Crafts</option>
            <option value="Sports and Athletics">Sports and Athletics</option>
            <option value="Entertainment and Pop Culture">
              Entertainment and Pop Culture
            </option>
          </select>
        </div>
      </div>
      <ReactQuill
        placeholder="Content goes here..."
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={setValue}
      />
      {isPublishing ? (
        <button
          type="submit"
          onClick={handleSubmit}
          className="hover:text-white/70 bg-[#7396ae] w-48 sm:w-1/5 rounded-md p-2 mt-2 absolute left-1/2 -translate-x-1/2 text-center flex gap-4 items-center justify-center "
        >
          Publishing
          <span className="animate-spin inline-block w-5 h-5 rounded-full border-white border-solid border-2 border-x-transparent"></span>
        </button>
      ) : (
        <button
          type="submit"
          onClick={handleSubmit}
          className="hover:text-white/70 bg-[#7396ae] w-1/5 rounded-md p-2 mt-2 absolute left-1/2 -translate-x-1/2 text-center "
        >
          Publish
        </button>
      )}
    </div>
  );
}

export default WriteArticle;
