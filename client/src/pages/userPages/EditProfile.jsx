import React, { useState, useEffect, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ArticleTag from "../../component/ArticleTag";
import { BlogContext } from "../../context/BlogContext";
import axios from "axios";
import { generateError, generatesuccess } from "../../utility/Toasts";

function EditProfile({ handleEditClick }) {
  const { user, setUser } = useContext(BlogContext);

  const [selectedTags, setSelectedTags] = useState([]);
  const [userName, setUserName] = useState(user?.user);

  const handleNameChange = (e) => {
    const { value } = e.target;
    setUserName(value);
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTags((prevTags) => {
      if (checked) {
        return [...prevTags, value];
      } else {
        return prevTags.filter((tag) => tag !== value);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://summer-blog-api.onrender.comupdate-user-info", {
        id: user._id,
        name: userName,
        tags: selectedTags,
      })
      .then((res) => {
        if (res.status == 200) {
          generatesuccess(res.data);
          setSelectedTags(null);
          setUser({ ...user, user: userName });
          setUserName();
          handleEditClick();
        } else {
          generateError(res.data);
          setSelectedTags(null);
          setUserName();
          handleEditClick();
        }
      })
      .catch((error) => {
        console.log(res.data);
      });
  };

  useEffect(() => {
    // console.log(selectedTags);
    axios
      .get(`https://summer-blog-api.onrender.comget/users/data/${user?._id}`)
      .then((res) => {
        setSelectedTags(res.data.interests);
      });
  }, []);

  const tags = [
    {
      id: "1",
      tag: "Web development",
    },
    {
      id: "2",
      tag: "Technology",
    },
    {
      id: "3",
      tag: "Travel",
    },
    {
      id: "4",
      tag: "Fashion and Style",
    },
    {
      id: "5",
      tag: "Arts and Crafts",
    },
    {
      id: "6",
      tag: "Sports and Athletics",
    },
    ,
    {
      id: "7",
      tag: "Entertainment and Pop Culture",
    },
  ];

  return (
    <div className="bg-black/50 z-30 min-h-[120vh] absolute top-0 left-0 w-[100vw]">
      <div className="bg-[#557a95] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 p-2 w-11/12 md:w-3/5 h-3/5 rounded-lg">
        <span
          onClick={handleEditClick}
          className="absolute right-2 hover:text-white/70"
        >
          <AiOutlineClose size={20} />
        </span>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-5 mb-5">
            <label htmlFor="user name">User Name</label>
            <input
              type="text"
              className="bg-[#7395ae] outline-none p-2 rounded-md placeholder:text-[#557a95]"
              id="user name"
              value={userName}
              onChange={handleNameChange}
              placeholder="Enter your name"
            />
          </div>

          {tags?.map((tag) => {
            return (
              <div key={tag.id} className="flex gap-1">
                <input
                  type="checkbox"
                  id={tag.id}
                  checked={selectedTags.includes(tag.tag)}
                  selected={true}
                  value={tag.tag}
                  className="outline-none accent-[#e2eaf1] border-2"
                  onChange={handleTagChange}
                />
                <label htmlFor={tag.id}>{tag.tag}</label>
              </div>
            );
          })}

          <button
            type="submit"
            className="text-center w-full mt-4 bg-[#7395ae] py-1 rounded-md hover:text-white/70"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
