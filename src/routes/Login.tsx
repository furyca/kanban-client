import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Label from "@/components/Modals/FormElements/Label";
import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import GoogleButton from "@/components/Auth/GoogleButton";
import { baseURL } from "@/utils/env";
import { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";

type LoginInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const serverError = useRef<null | string>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();
  const { token, setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ ...data }),
      });

      if (!response.ok) {
        serverError.current = "Could not log in.";
        return;
      }

      const json = await response.json();

      if (json) {
        localStorage.setItem("token", json.token);
        setToken(json.token);
        setUser({ ...json.user });
      }
    } catch (e: any) {
      serverError.current = e.message;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="w-11/12 mt-5 p-2 md:w-1/3 md:p-6 gap-1 flex flex-col bg-neutral-300 drop-shadow-xl mx-auto text-zinc-800 opacity-75 rounded-sm"
      data-testid="form-log-in"
    >
      <h1 className="text-2xl md:text-3xl text-center font-extrabold tracking-wider mb-2">Login</h1>
      <section className="mb-4">
        <Label forElement="login-email" text="Email" />
        <div className="relative">
          <EnvelopeClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-1 md:top-3" />
          <input
            id="login-email"
            className="pb-1 pt-0 pe-0 ps-8 md:py-3 md:ps-10 text-sm md:text-base w-full border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="text"
            placeholder="Email"
            {...register("email", { required: true })}
            data-testid="login-email"
          />
          {errors.email && <span className="text-sm md:text-base text-red-600">This field is required</span>}
        </div>
      </section>
      <section className="mb-4">
        <Label forElement="login-password" text="Password" />
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-1 md:top-3" />
          <input
            id="login-password"
            className="pb-1 pt-0 pe-0 ps-8 md:py-3 md:ps-10 text-sm md:text-base w-full border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="password"
            placeholder="Create a password"
            {...register("password", { required: true })}
            data-testid="login-password"
          />
        </div>
        {errors.password && <span className="text-sm md:text-base text-red-600">This field is required</span>}

        <Link to="" className="mt-2 text-sm md:text-base text-end block text-gray-950 font-medium hover:underline">
          Forgot password?
        </Link>
      </section>
      <Button
        type="submit"
        className="p-6 text-lg tracking-wider w-11/12 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 hover:opacity-100 hover:drop-shadow-xl"
        data-testid="login-button"
        disabled={loading}
      >
        {loading && <LoaderCircle className="animate-spin" />}
        LOGIN
      </Button>
      <GoogleButton text="signin_with" />
      <Link
        to="/signup"
        className="hover:underline mt-3 text-sm md:text-base text-center text-gray-950 font-medium"
        data-testid="route-signup-login-form"
      >
        Don't have an account? Sign up.
      </Link>
    </form>
  );
};

export default Login;
