import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { handleGoogleLogin } from "../../lib/api/api";
import { useStore } from "../../lib/store/userStore";
import { useMutation } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";
import toast from "react-hot-toast";
export default function GoogleLoginButton() {
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);

  function notify(type: string, message: string) {
    if (type === "error") {
      toast.error(message);
    }
    if (type === "success") {
      toast.success(message);
    }
  }

  const { isLoading, mutate } = useMutation({
    mutationFn: handleGoogleLogin, // Axios call
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      notify("success", "Login success!");
    },
    onError: (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        notify("error", error.response?.data);
      } else {
        notify("error", error.message);
      }
    },
  });
  return (
    <div className="w-full pt-2">
      {isLoading && <p className="mt-2 mb-2">Validating your identity...</p>}
      <GoogleLogin
        text={"continue_with"}
        onSuccess={(credentialResponse) => {
          mutate(credentialResponse);
        }}
        shape="rectangular"
      />
    </div>
  );
}
