import React, { useContext, useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import NavBar from "../component/nav_bar/NavBar";
import EditProfile from "./userPages/EditProfile";
import { generateError, generatesuccess } from "../utility/Toasts";
import BookMarkItem from "./BookMarkItem";
import { BlogContext } from "../context/BlogContext";
import axios from "axios";
import ChangePassword from "./userPages/ChangePassword";

function LibraryPage() {
  const { user, setUser } = useContext(BlogContext);
  const [bookMarks, setBookMarks] = useState();
  const [isEditVisiable, setEditIsVisiable] = useState(false);
  const [isChangePasswordVisiable, setIsChangePasswordVisiable] =
    useState(false);

  const handleEditClick = () => {
    setEditIsVisiable(!isEditVisiable);
  };

  const handleChangeClick = () => {
    setIsChangePasswordVisiable(!isChangePasswordVisiable);
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    const fileExtention = file.name.split(".")[1];
    if (fileExtention !== "php") {
      const formData = new FormData();
      formData.append("profile-img", file);
      formData.append("id", user?._id);
      axios
        .post("http://localhost:3007/change-profile-image", formData)
        .then((res) => {
          if (res.status == 200) {
            generatesuccess(res.data);
            setUser(res.data);
          } else {
            generateError(res.data);
          }
        });
    } else {
      generateError("Invalid file formate!");
    }
  };

  const handleGetBookMarks = () => {
    axios
      .post("http://localhost:3007/get/my/book-marks", { userId: user?._id })
      .then((res) => {
        if (res.status == 200) {
          setBookMarks(res.data?.bookMarks);
        }
      })
      .catch((error) => {
        generateError(error);
      });
  };

  const handleDelete = (id) => {
    setBookMarks(
      bookMarks.filter((bookMark) => {
        return bookMark?._id !== id;
      })
    );
  };

  useEffect(() => {
    handleGetBookMarks();
  }, []);

  useEffect(() => {
    if (isEditVisiable || isChangePasswordVisiable) {
      document.body.classList.add("hide");
    } else {
      document.body.classList.remove("hide");
    }
  }, [isEditVisiable, isChangePasswordVisiable]);

  return (
    <div className="p-2 min-h-screen">
      <NavBar />
      <div className="flex pt-4 gap-2 h-full flex-col-reverse md:flex-row">
        <div className="no-scrollbar flex-[2] flex flex-col gap-2 max-h-screen overflow-y-scroll">
          {bookMarks == undefined ? (
            <p>No bookmark Yet</p>
          ) : (
            bookMarks?.map((bookMark) => {
              return (
                <BookMarkItem
                  key={bookMark?._id}
                  _id={bookMark?._id}
                  userId={user?._id}
                  user={bookMark?.author}
                  profile={bookMark?.author?.profile}
                  header={bookMark?.header}
                  thumbnail={bookMark?.thumbnail}
                  content={bookMark?.content}
                  createdAt={bookMark?.createdAt}
                  handleDelete={handleDelete}
                />
              );
            })
          )}
          {/* <BookMarkItem />
          <BookMarkItem /> */}
        </div>
        <div className="bg-[#7395ae] flex-1 pl-10 pt-10 pb-1 rounded-md">
          <div className="flex gap-2 items-center md:block">
            <div className="relative">
              <img
                className="w-20 h-20 max-h-20 rounded-full border-2 object-cover "
                src={user?.profile}
                alt="profile image"
              />
              <div
                title="Edit Profile"
                className=" p-1 rounded-full text-center w-7 flex items-center h-7 bg-[#557a95]/70 hover:cursor-pointer absolute top-0 left-0"
                onClick={() => {
                  let input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/png, image/jpeg, image/jpg ";
                  input.addEventListener("change", handleProfileImage);
                  input.click();
                }}
              >
                <BiEdit size={24} />
              </div>
            </div>
            <p className="font-bold">{user?.user}</p>
            <p
              className="text-sm hover:text-[#557a95] hover:underline"
              onClick={handleEditClick}
            >
              Edit profile
            </p>
            <p
              className="text-sm hover:text-[#557a95] hover:underline"
              onClick={handleChangeClick}
            >
              Change password
            </p>
          </div>
        </div>
      </div>
      {isEditVisiable && <EditProfile handleEditClick={handleEditClick} />}
      {isChangePasswordVisiable && (
        <ChangePassword handleChangeClick={handleChangeClick} />
      )}
    </div>
  );
}

export default LibraryPage;
