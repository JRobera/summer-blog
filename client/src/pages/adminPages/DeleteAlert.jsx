import React from "react";

function DeleteAlert({ handleClose, handleDeleteArticle }) {
  return (
    <div className="flex flex-col gap-2 absolute top-0 left-0 w-full bg-[#7396ae] text-center p-3 translate-y-2">
      <div
        className="inline-flex justify-end hover:cursor-pointer"
        onClick={handleClose}
      >
        <box-icon name="x" color="white"></box-icon>
      </div>
      <div>
        <p>Are you sure went to delete this article ?</p>
      </div>
      <div className="flex justify-end ">
        <button className="hover:text-[#557a95]" onClick={handleDeleteArticle}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteAlert;
