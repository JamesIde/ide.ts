import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "../../lib/store/userStore";
import { notify } from "../../lib/toastr/Notify";
import { handleSessionLogout } from "../../lib/api/api";
function Signout() {
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);

  const { mutate } = useMutation({
    mutationFn: handleSessionLogout,
    onSuccess: () => {
      setUser(null);
      sessionStorage.removeItem("user");
      notify("success", "Logout successfully");
    },
    onError: (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        notify("error", error.response?.data);
      } else {
        notify("error", error.message);
      }
    },
  });

  function handleSignout() {
    mutate();
  }
  return (
    <>
      {user && (
        <div
          className="mt-2 ml-auto p-2 border-[1px] text-red-700 border-red-800 hover:bg-red-800 duration-500 w-min hover:cursor-pointer rounded hover:text-white font-bold text-sm"
          onClick={() => handleSignout()}
        >
          Logout
        </div>
      )}
    </>
  );
}
export default Signout;
