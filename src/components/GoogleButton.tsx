import useUserStore from "@/store/userStore";
import sendPostReq from "@/utils/sendPostReq";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

type TextType = "signin_with" | "signup_with" | "continue_with" | "signin" | undefined

const GoogleButton = ({ text }: { text: TextType }) => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const json = await sendPostReq({
      path: "/googleAuth",
      opts: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.credential }),
      },
    });

    json && setUser({ username: json.username, userID: json.sessionID });
    json.redirect && navigate(json.redirect);
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };
  return (
    <div className="mx-auto">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        auto_select
        locale="en"
        shape="pill"
        width={400}
        text={text}
      />
    </div>
  );
};

export default GoogleButton;
