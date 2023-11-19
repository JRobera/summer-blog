import React, { useEffect, useState } from "react";
import NavBar from "../component/nav_bar/NavBar";
import api from "../utility/axios";

function About() {
  const [about, setAbout] = useState();

  useEffect(() => {
    api.get("/about/info").then((response) => {
      setAbout(response.data);
    });
  }, []);

  return (
    <section className="w-full min-h-screen p-2">
      <NavBar />
      <div className="container mx-auto mt-8 min-h-full flex flex-col lg:w-11/12 sm:flex-row">
        <div className="w-1/2 mr-2 sm:mr-6">
          <img
            className="w-20 h-20 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:h-52 lg:w-52 sm:mx-auto rounded-full"
            src={about?.profile}
            alt="My photo"
          />
        </div>

        <div>
          <p className="font-bold text-2xl">About Page</p>
          <p className="">{about?.text}</p>
        </div>
      </div>
    </section>
  );
}

export default About;
