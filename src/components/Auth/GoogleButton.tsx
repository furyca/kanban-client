import useAuthStore from "@/store/authStore";
import useUIStatusStore from "@/store/uiStatusStore";
import useUserStore from "@/store/userStore";
import { baseURL } from "@/utils/env";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

type TextType = "signin_with" | "signup_with" | "continue_with" | "signin" | undefined;

const GoogleButton = ({ text }: { text: TextType }) => {
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();
  const { setLoading } = useUIStatusStore();

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
    setLoading(true);
    const response = await fetch(`${baseURL}/googleAuth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token: credentialResponse.credential }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    if (json) {
      localStorage.setItem("token", json.token);
      setToken(json.token);
      setUser({...json.user});
    }
    setLoading(false);
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
        useOneTap
      />
    </div>
  );
};

export default GoogleButton;
