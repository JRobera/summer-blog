import React from "react";

function UserTabs() {
  const userTabs = [
    {
      link: "",
      title: "Published Articles",
    },
  ];

  return (
    <nav className="bg-[#557a95] p-1 m-1 rounded-sm flex gap-2">
      {userTabs?.map((userTab, i) => {
        return (
          <p className="text-sm hover:text-[#7395ae] w-fit" key={i}>
            {userTab?.title}
          </p>
        );
      })}
    </nav>
  );
}

export default UserTabs;
