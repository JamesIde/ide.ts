import toast from "react-hot-toast";
export function notify(type: string, message: string) {
  if (type === "error") {
    toast.error(message);
  }
  if (type === "success") {
    toast.success(message);
  }
}

export function validateComment(comment: string) {
  if (comment.length > 1000) {
    toast.error("Comment is too long. Please keep it under 1000 characters");
    return false;
  } else if (comment.length < 10) {
    toast.error("Comment is too short. Minimum 10 characters");
    return false;
  }
  return true;
}
