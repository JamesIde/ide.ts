import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { getTokenFromStorage } from "../../lib/jwt/auth";
import { useStore } from "../../lib/store/userStore";
import baseClient from "../../lib/api/baseClient";
export default function GoogleLoginButton() {
  const [error, setError] = useState(null);
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  async function handleLogin(credential: CredentialResponse) {
    try {
      const response = await baseClient.post("/api/identity", {
        OAuthToken: credential.credential,
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  }

  async function createComment() {
    const token = getTokenFromStorage();
    try {
      const response = await baseClient.post(
        "/api/comments?contentfulId=c23812d0-b298-4fc1-b1b2-b380fc371418",
        {},
        {
          headers: {
            Authorization: `Bearer ${token ? token : ""}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      setError(error.response.data);
    }
  }

  return (
    <div className="w-full p-2">
      {/* TODO Styling and hide this component if user in LS */}
      <GoogleLogin
        text={"continue_with"}
        onSuccess={(credentialResponse) => {
          handleLogin(credentialResponse);
        }}
        shape="rectangular"
      />
      {error ? <p>{error}</p> : null}
    </div>
  );
}
