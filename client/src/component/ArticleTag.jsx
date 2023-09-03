import React, { useEffect, useState } from "react";

function ArticleTag({ id, tag }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const handleChange = (e) => {
    const { value, checked } = e.target;
    // console.log(value);
    setSelectedTags((prevTags) => {
      console.log(prevTags);

      if (checked) {
        return [...prevTags, value];
      } else {
        console.log(prevTags);
        return prevTags.filter((tag) => tag !== value);
      }
    });
  };
  useEffect(() => {
    console.log(selectedTags);
  }, [selectedTags]);
  return (
    <div className="">
      <input
        type="checkbox"
        id={id}
        value={tag}
        className=""
        onChange={handleChange}
      />
      <label htmlFor={id}>{tag}</label>
    </div>
  );
}

export default ArticleTag;
