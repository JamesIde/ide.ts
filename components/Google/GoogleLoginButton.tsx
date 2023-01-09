import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { getTokenFromStorage } from "../../lib/auth";
import baseClient from "../../lib/baseClient";
export default function GoogleLoginButton() {
  const [error, setError] = useState(null);
  async function handleLogin(credential: CredentialResponse) {
    try {
      const response = await baseClient.post("/api/identity", {
        OAuthToken: credential.credential,
      });
      localStorage.setItem("user", JSON.stringify(response.data));
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
    <div className="w-2/12">
      {/* TODO Styling and hide this component if user in LS */}
      <GoogleLogin
        text={"continue_with"}
        onSuccess={(credentialResponse) => {
          handleLogin(credentialResponse);
        }}
        shape="rectangular"
      />
      <button onClick={() => createComment()}>
        Send Mock Comment To Backend
      </button>
      {error ? <p>{error}</p> : null}
    </div>
  );
}
