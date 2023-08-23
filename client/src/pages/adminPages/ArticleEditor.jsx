import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../../assets/reactQuill";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { ToastContainer } from "react-toastify";

function ArticleEditor() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [value, setValue] = useState("");
  const [header, setHeader] = useState("");
  const [thumbnail, setThumbnail] = useState();

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    const fileExtention = thumbnail.name.split(".")[1];

    if (fileExtention !== "php") {
      formData.append("header", header);
      formData.append("thumbnail", thumbnail);
      formData.append("article", value);
      setIsPublishing(true);
      if (header !== "" && value !== "") {
        axios
          .post("http://localhost:3007/publish/article", formData)
          .then((response) => {
            if (response.status == 200) {
              generatesuccess(response.data);
              setHeader("");
              setValue("");
              setIsPublishing(false);
            } else {
              setIsPublishing(false);
              generateError(response.data);
            }
          });
      } else {
        generateError("Can not publish article with empty header or article!");
      }
    } else {
      generateError("Invalid file formate!");
    }
  };

  useEffect(() => {
    // console.log(value);
  }, [value]);
  return (
    <div className=" flex-1 h-screen overflow-y-scroll">
      <div className="flex flex-col gap-2">
        <textarea
          name=""
          id=""
          value={header}
          placeholder="Header"
          className="md:text-4xl text-lg font-semibold md:h-16 h-12 p-2 bg-[#7395ae] border-2 border-[#5d5c61] outline-none resize-none rounded-lg "
          onChange={(e) => {
            setHeader(e.target.value);
          }}
        ></textarea>
        <div className=" flex justify-center mb-2 relative">
          <div className="relative">
            <label
              className=" absolute bg-[#7395ae] w-full h-full text-center hover:text-[#5d5c61] font-semibold p-1 rounded-md cursor-pointer"
              htmlFor="thumbnail"
            >
              Select Thumbnail Image
            </label>
            <input
              className=" text-center rounded-md"
              id="thumbnail"
              type="file"
              accept="image/png, image/jpeg, image/jpg "
              onChange={handleThumbnail}
            />
          </div>
        </div>
      </div>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={setValue}
      />
      <button
        type="submit"
        onClick={handleSubmit}
        className="hover:text-[#5c5d61] bg-[#7396ae] w-1/5 rounded-md p-2 mt-2 absolute right-8 text-center "
      >
        {isPublishing ? "Publishing" : "Publish"}
      </button>
      <ToastContainer />
    </div>
  );
}

export default ArticleEditor;
