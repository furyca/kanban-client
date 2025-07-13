import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { patterns } from "../utils/patterns";
import Label from "@/components/Modals/FormElements/Label";
import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import GoogleButton from "@/components/Auth/GoogleButton";
import { baseURL } from "@/utils/env";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";

type SignUpInputs = {
  email: string;
  password: string;
};

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const serverError = useRef<null | string>(null);
  const { token } = useAuthStore();
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ ...data }),
      });

      if (!response.ok) {
        serverError.current = "Could not sign up.";
        return;
      }

      navigate('/login')
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
      className="w-11/12 mt-5 p-2 md:w-2/3 lg:w-1/3 md:p-6 gap-1 flex flex-col bg-neutral-300 drop-shadow-xl mx-auto text-zinc-800 opacity-75 rounded-sm overflow-auto h-[calc(100%-72px)] max-h-fit"
      data-testid="form-sign-up"
    >
      <h1 className="text-2xl md:text-3xl text-center font-extrabold tracking-wider mb-2">Sign up</h1>
      <section className="mb-2">
        <Label forElement="signup-email" text="Email" />
        <div className="relative">
          <EnvelopeClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-1 md:top-3" />
          <input
            id="signup-email"
            className="pb-1 pt-0 pe-0 ps-8 md:py-3 md:ps-10 text-sm md:text-base w-full border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="email"
            placeholder="Email"
            {...register("email", { required: true, pattern: patterns.email })}
          />
        </div>
        {errors.email && <span className="text-sm md:text-base text-red-600">Invalid email</span>}
      </section>
      {/* <section className="mb-2">
        <Label forElement="signup-username" text="Username" />
        <div className="relative">
          <AvatarIcon className="w-5 h-5 text-gray-600 absolute left-1 top-1 md:top-3" />
          <input
            id="signup-username"
            className="pb-1 pt-0 pe-0 ps-8 md:py-3 md:ps-10 text-sm md:text-base w-full border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="text"
            placeholder="Username"
            {...register("username", { required: true, minLength: 3, maxLength: 48 })}
          />
        </div>
        {errors.username && (
          <>
            <p className="text-sm md:text-base text-red-600">Invalid username</p>
            <p className="text-sm md:text-base">Username must be between 3-48 characters long</p>
          </>
        )}
       </section> */}
      <section className="mb-2">
        <Label forElement="signup-password" text="Password" />
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-1 md:top-3" />
          <input
            id="signup-password"
            className="pb-1 pt-0 pe-0 ps-8 md:py-3 md:ps-10 text-sm md:text-base w-full border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="password"
            placeholder="Create a password"
            {...register("password", { required: true, pattern: patterns.password })}
          />
        </div>
        {errors.password && (
          <>
            <p className="text-sm md:text-base text-red-600">
              Password must include at least one lowercase, uppercase, digit and other character
            </p>
            <p className="text-sm md:text-base">Password must be at least 8 characters long</p>
          </>
        )}
      </section>
      <Button
        type="submit"
        className="p-6 text-lg tracking-wider w-11/12 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 hover:opacity-100 hover:drop-shadow-xl"
        disabled={loading}
      >
        {loading && <LoaderCircle className="animate-spin" />}
        SIGN UP
      </Button>
      <GoogleButton text="signup_with" />
      <Link
        to="/login"
        className="hover:underline text-sm md:text-base mt-3 text-center text-gray-950 font-medium"
        data-testid="route-login-signup-form"
      >
        Already have an account? Log in.
      </Link>
    </form>
  );
};

export default SignUp;
