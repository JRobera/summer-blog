const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.COULD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

uploadToCloudinary = (path, folder) => {
  return cloudinary.v2.uploader
    .upload(path, {
      resource_type: "image",
      folder,
    })
    .then((data) => {
      return { url: data.url, public_id: data.public_id, format: data.format };
    })
    .catch((error) => {
      console.log(error);
    });
};

removeFromCloudinary = async (public_id) => {
  await cloudinary.v2.uploader.destroy(public_id, function (error, result) {
    console.log(result, error);
  });
};

module.exports = {
  uploadToCloudinary,
  removeFromCloudinary,
};
