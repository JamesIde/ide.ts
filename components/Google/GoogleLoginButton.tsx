import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import wretch from "wretch";
import { User } from "../../@types/Profile";
import { getTokenFromStorage } from "../../lib/auth";
export default function GoogleLoginButton() {
  async function handleLogin(credential: CredentialResponse) {
    wretch("/api/identity")
      // .auth(`Bearer $`)
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
      .json((data: User) => {
        localStorage.setItem("user", JSON.stringify(data));
      });
  }

  async function createComment() {
    const token = getTokenFromStorage();
    wretch("/api/comments?contentfulId=3zsIHczhEyQ3OdCfxxlve6")
      .auth(`Bearer ${token ? token : ""}`)
      .post()
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
    </div>
  );
}
