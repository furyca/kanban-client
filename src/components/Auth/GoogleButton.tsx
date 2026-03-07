import useAuthStore from "@/store/auth/auth.store";
import { GoogleLogin } from "@react-oauth/google";

type TextType = "signin_with" | "signup_with" | "continue_with" | "signin" | undefined;

const GoogleButton = ({ text }: { text: TextType }) => {
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const width = () => {
    if (window.innerWidth > 1024) {
      return 400;
    }
    if (window.innerWidth < 375) {
      return 100;
    }
    return 200;
  };

  return (
    <div className="mx-auto">
      <GoogleLogin
        onSuccess={googleLogin}
        onError={() => console.log("Login Failed")}
        auto_select
        shape="pill"
        width={width()}
        text={text}
        useOneTap
      />
    </div>
  );
};

export default GoogleButton;
