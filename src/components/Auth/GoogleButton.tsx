import useUserStore from "@/store/userStore";
import { baseURL } from "@/utils/env";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

type TextType = "signin_with" | "signup_with" | "continue_with" | "signin" | undefined;

const GoogleButton = ({ text }: { text: TextType }) => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const width = () => {
    if (window.innerWidth > 1024) {
      return 400;
    }
    if (window.innerWidth < 375) {
      return 100;
    }
    return 200;
  };

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const response = await fetch(`${baseURL}/googleAuth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token: credentialResponse.credential }),
    });

    const json = await response.json();

    json && setUser({ username: json.user.username, id: json.user.sessionID, email: json.user.email });
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
        width={width()}
        text={text}
      />
    </div>
  );
};

export default GoogleButton;
