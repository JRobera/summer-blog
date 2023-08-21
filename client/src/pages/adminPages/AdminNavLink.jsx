import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "../../context/BlogContext";

function AdminNavLink() {
  const { tab, setTab } = useContext(BlogContext);
  //   const [tab, setTab] = useState("0");
  const links = [
    { link: "home", color: "#fff", title: "Admin home page" },
    { link: "edit-alt", color: "#fff", title: "Write new article" },
    { link: "user-plus", color: "#fff", title: "Add new admin account" },
    { link: "grid", color: "#fff", title: "Update password" },
    { link: "user-minus", color: "#fff", title: "Delete admin account" },
    { link: "user", color: "#fff", title: "Edit about page" },
  ];

  const handleClick = () => {};

  return (
    <>
      {links.map((link, i) => {
        return (
          <div
            key={i}
            className={
              tab == i
                ? "bg-[#557a96] text-white p-2 rounded-lg"
                : "hover:bg-[#557a96] hover:text-white p-2 rounded-lg hover:animate-bounce"
            }
            onClick={() => {
              setTab(i);
            }}
            title={link.title}
            id={i}
          >
            <box-icon name={link.link} color={link.color}></box-icon>
          </div>
        );
      })}
    </>
  );
}

export default AdminNavLink;
