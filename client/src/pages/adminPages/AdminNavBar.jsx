import React from "react";
import AdminNavLink from "./AdminNavLink";

function AdminNavBar() {
  return (
    <nav className="bg-[#7395ae] w-max min-h-screen p-2 flex flex-col gap-4 shadow-lg pt-12">
      <AdminNavLink />
    </nav>
  );
}

export default AdminNavBar;
