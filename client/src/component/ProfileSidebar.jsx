import axios from "axios";
import { useContext } from "react";
import { BiEdit } from "react-icons/bi";
import { BlogContext } from "../context/BlogContext";

function ProfileSidebar({ handleEditClick, handleChangeClick }) {
  const { user, setUser } = useContext(BlogContext);
  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    const fileExtention = file.name.split(".")[1];
    if (fileExtention !== "php") {
      const formData = new FormData();
      formData.append("profile-img", file);
      formData.append("id", user?._id);
      axios
        .post(
          "https://summer-blog-api.onrender.comchange-profile-image",
          formData
        )
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

  return (
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
          <p className="font-bold">{user?.user}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p
            className="text-sm w-fit hover:text-white/70  hover:underline"
            onClick={handleEditClick}
          >
            Edit profile
          </p>
          <p
            className="text-sm w-fit hover:text-white/70 hover:underline"
            onClick={handleChangeClick}
          >
            Change password
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;
