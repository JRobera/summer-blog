import React from "react";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PopUp({ id, handleDelete }) {
  const history = useNavigate();
  const redirect = () => {
    history(`/update/article/${id}`);
  };
  const actions = [
    { name: "Edit", icon: "BiEdit" },
    { name: "Delete", icon: "AiOutlineDelete" },
  ];

  const handleClick = (name) => {
    if (name === "Edit") {
      redirect();
    } else {
      handleDelete(id);
    }
  };

  return (
    <div className="bg-[#557a95] flex flex-col gap-1 absolute right-0 w-32 rounded-md">
      {actions.map((action, i) => {
        return (
          <p
            key={i}
            className="hover:text-[#7395ae] p-1 text-left flex items-center gap-1"
            onClick={() => handleClick(action?.name)}
          >
            {action?.name === "Edit" ? <BiEdit /> : <AiOutlineDelete />}
            {action?.name}
          </p>
        );
      })}
    </div>
  );
}

export default PopUp;
