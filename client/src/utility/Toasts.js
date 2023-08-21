import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateError = (error) =>
  toast.error(error, {
    position: "bottom-right",
  });
const generatesuccess = (success) =>
  toast.success(success, {
    position: "bottom-right",
  });

export { generateError, generatesuccess };
