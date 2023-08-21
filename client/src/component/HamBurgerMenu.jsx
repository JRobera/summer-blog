import React, { useState } from "react";

function HamBurgerMenu({ handleMenuClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => {
        handleMenuClick();
        setIsOpen(!isOpen);
      }}
      className="md:hidden w-8 h-8 flex flex-col gap-1 flex-1 items-end justify-center"
    >
      <span
        className={
          isOpen
            ? " translate-y-1 rotate-45 duration-700 inline-block w-6 h-0.5 bg-[#557a95] rounded-md "
            : "w-6 h-0.5 bg-[#557a95] rounded-md inline-block duration-700"
        }
      ></span>
      <span
        className={
          isOpen
            ? ""
            : "w-6 h-0.5 bg-[#557a95] rounded-md inline-block duration-700"
        }
      ></span>
      <span
        className={
          isOpen
            ? " -translate-y-1.5 -rotate-45 duration-700 inline-block w-6 h-0.5 bg-[#557a95] rounded-md"
            : "inline-block w-6 h-0.5 bg-[#557a95] rounded-md duration-700"
        }
      ></span>
    </div>
  );
}

export default HamBurgerMenu;
