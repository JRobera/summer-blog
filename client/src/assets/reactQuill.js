const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ script: "sub" }, { script: "super" }],
    ["code-block"],
    ["link", "image", "video"],
    ["clean"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "align",
  "script",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export { modules, formats };
