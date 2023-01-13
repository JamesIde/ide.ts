import toast from "react-hot-toast";
export function notify(type: string, message: string) {
  if (type === "error") {
    toast.error(message);
  }
  if (type === "success") {
    toast.success(message);
  }
}
