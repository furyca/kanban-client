import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserStore from "../store/userStore";
import sendPostReq from "../utils/sendPostReq";
import { Button } from "@/components/ui/button";
import Label from "@/components/Label";
import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import GoogleButton from "@/components/GoogleButton";

type LoginInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();
  const navigate = useNavigate();
  useAuth();
  const { setUser } = useUserStore();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const json = await sendPostReq({
        path: "/login",
        opts: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...data }),
        },
      });

      json && setUser({ username: json.username, userID: json.sessionID });
      json.redirect && navigate(json.redirect);
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-neutral-300 drop-shadow-xl mt-12 mx-auto p-7 w-1/3 text-black opacity-75 rounded-sm"
      data-testid="form-log-in"
    >
      <h1 className="text-4xl text-center font-extrabold tracking-wider">Login</h1>
      <section className="mb-4">
        <Label forElement="login-email" text="Email" />
        <div className="relative">
          <EnvelopeClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-3.5" />
          <input
            id="login-email"
            className="p-3 ps-10 w-full border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="text"
            placeholder="Email"
            {...register("email", { required: true })}
            data-testid="login-email"
          />
          {errors.email && <span>This field is required</span>}
        </div>
      </section>
      <section className="mb-4 ">
        <Label forElement="login-password" text="Password" />
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-3.5" />
          <input
            id="login-password"
            className="p-3 ps-10 w-full border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="password"
            placeholder="Create a password"
            {...register("password", { required: true })}
            data-testid="login-password"
          />
        </div>

        <Link to="" className="mt-2 text-end block text-gray-950 font-medium hover:underline">
          Forgot password?
        </Link>
        {errors.password && <span>This field is required</span>}
      </section>
      <Button
        type="submit"
        className="p-6 text-lg tracking-wider w-11/12 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 hover:opacity-100 hover:drop-shadow-xl"
        data-testid="login-button"
      >
        LOGIN
      </Button>
      <GoogleButton text="signin_with" />
      <Link
        to="/signup"
        className="hover:underline mt-5 text-center text-gray-950 font-medium"
        data-testid="route-signup-login-form"
      >
        Don't have an account? Sign up.
      </Link>
    </form>
  );
};

export default Login;
