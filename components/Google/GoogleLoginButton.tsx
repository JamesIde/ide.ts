import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { ProcessGoogleLogin } from "../../lib/api/api";
import { useStore } from "../../lib/store/userStore";
import { useMutation } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";
export default function GoogleLoginButton() {
  const [loginError, setLoginError] = useState<any>();
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const { isLoading, isError, mutate } = useMutation({
    mutationFn: ProcessGoogleLogin, // Axios call
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    },
    onError: (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        setLoginError(error.response.data);
      } else {
        setLoginError(error);
      }
    },
  });
  return (
    <div className="w-full p-2">
      {isLoading && <p className="mt-2 mb-2">Validating your identity...</p>}
      <GoogleLogin
        text={"continue_with"}
        onSuccess={(credentialResponse) => {
          mutate(credentialResponse);
        }}
        shape="rectangular"
      />
      {isError && (
        <p className="text-red-500 mt-3 text-sm mx-auto text-center">
          {loginError}
        </p>
      )}
    </div>
  );
}
