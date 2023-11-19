import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../../assets/reactQuill";
import api from "../../utility/axios.js";
import { generateError, generatesuccess } from "../../utility/Toasts";
import { useNavigate, useParams } from "react-router-dom";

function UpdateArticle() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [value, setValue] = useState("");
  const [header, setHeader] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [tag, setTag] = useState("Choose Tag here");
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setSelectedFile(file.name);
  };

  useEffect(() => {
    api
      .get(`/article/to-update/${id}`)
      .then((res) => {
        const { header, tag, content } = res.data;
        setHeader(header);
        setTag(tag);
        setValue(content);
      })
      .catch((error) => {});
  }, []);

  const handleSubmit = () => {
    const formData = new FormData();
    const fileExtention =
      thumbnail !== null ? thumbnail.name.split(".")[1] : null;
    if (fileExtention !== "php" || fileExtention == null) {
      formData.append("id", id);
      formData.append("header", header);
      formData.append("thumbnail", thumbnail);
      formData.append("tag", tag);
      formData.append("article", value);

      setIsUpdating(true);
      if (header !== "" && value !== "" && thumbnail !== "" && tag !== "") {
        api.post("/update/article", formData).then((response) => {
          if (response.status == 200) {
            generatesuccess(response.data);
            setHeader("");
            setValue("");
            setIsUpdating(false);
            setSelectedFile("Select profile image");
            setTag("Choose Tag here");
            navigate("/profile");
          } else {
            setIsUpdating(false);
            generateError(response.data);
            setSelectedFile("Select profile image");
            setTag("Choose Tag here");
            navigate("/profile");
          }
        });
      } else {
        setIsUpdating(false);
        generateError("All inputs required!");
      }
    } else {
      setIsUpdating(false);
      generateError("Invalid file formate!");
      setSelectedFile("Select profile image");
      setTag("Choose Tag here");
    }
  };

  return (
    <div className=" flex-1 h-screen overflow-y-scroll relative">
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
        <div className=" flex gap-2 flex-col w-4/5 sm:w-3/5 mx-auto sm:flex-row justify-center mb-2 relative">
          <div className="relative">
            <label
              className=" absolute bg-[#7395ae] w-full h-full text-center hover:text-[#5d5c61] font-semibold p-1 rounded-md cursor-pointer"
              htmlFor="thumbnail"
            >
              {}
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
            className="bg-[#7395ae] outline-none rounded-md text-center p-2"
            onChange={(e) => {
              setTag(e.target.value);
            }}
            value={tag}
          >
            <option value="DEFAULT" disabled hidden>
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
      {isUpdating ? (
        <button
          type="submit"
          onClick={handleSubmit}
          className="hover:text-[#5c5d61] bg-[#7396ae] w-1/5 rounded-md p-2 mt-2 absolute left-1/2 -translate-x-1/2 text-center flex gap-4 items-center justify-center "
        >
          Publishing
          <span className="animate-spin inline-block w-5 h-5 rounded-full border-white border-solid border-2 border-x-transparent"></span>
        </button>
      ) : (
        <button
          type="submit"
          onClick={handleSubmit}
          className="hover:text-[#5c5d61] bg-[#7396ae] w-1/5 rounded-md p-2 mt-2 absolute left-1/2 -translate-x-1/2 text-center "
        >
          Publish
        </button>
      )}
    </div>
  );
}

export default UpdateArticle;
