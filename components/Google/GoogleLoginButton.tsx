import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import wretch from "wretch";
export default function GoogleLoginButton() {
  async function handleLogin(credential: CredentialResponse) {
    wretch("/api/identity")
      .post({
        OAuthToken: credential.credential,
      })
      // shrink this down lol
      .unauthorized((err) => {
        console.log(err.message);
      })
      .internalError((err) => {
        console.log(err.message);
      })
      .forbidden((err) => {
        console.log(err);
      })
      .fetchError((err) => {
        console.log(err);
      })
      .json((data) => {
        console.log(data);
      });
  }

  function handleClick() {
    const resp = wretch("/api/hello")
      .get()
      .json((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
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
    </div>
  );
}
