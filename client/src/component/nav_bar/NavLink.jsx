import React from "react";
import { Link } from "react-router-dom";

function NavLink({ link, linkName, color }) {
  return (
    <div className="font-semibold hover:text-white/70 ">
      <Link to={link}>{linkName}</Link>
      {/* <a href={link}>{linkName}</a> */}
    </div>
  );
}

export default NavLink;
