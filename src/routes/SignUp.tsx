import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { patterns } from "../utils/patterns";
import sendPostReq from "../utils/sendPostReq";
import { Button } from "@/components/ui/button";
import Label from "@/components/Label";
import { AvatarIcon, EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import GoogleButton from "@/components/GoogleButton";

type SignUpInputs = {
  email: string;
  username: string;
  password: string;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>();
  useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    try {
      await sendPostReq({
        path: "/signup",
        opts: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...data }),
        },
      });

      navigate("/login");
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 bg-neutral-300 drop-shadow-xl mt-12 mx-auto p-7 w-1/3 text-black opacity-75 rounded-sm"
      data-testid="form-sign-up"
    >
      <h1 className="text-4xl text-center font-extrabold tracking-wider">Sign up</h1>
      <section className="mb-2">
        <Label forElement="signup-email" text="Email" />
        <div className="relative">
          <EnvelopeClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-3.5" />
          <input
            id="signup-email"
            className="p-3 ps-10 w-full rounded-sm border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="email"
            placeholder="Email"
            {...register("email", { pattern: patterns.email })}
          />
        </div>
        {errors.email && <p>Invalid email</p>}
      </section>
      <section className="mb-2">
        <Label forElement="signup-username" text="Username" />
        <div className="relative">
          <AvatarIcon className="w-5 h-5 text-gray-600 absolute left-1 top-3.5" />
          <input
            id="signup-username"
            className="p-3 ps-10 w-full rounded-sm border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="text"
            placeholder="Username"
            {...register("username", { required: true, minLength: 3, maxLength: 48 })}
          />
        </div>
        {errors.username && (
          <>
            <p>Invalid username</p>
            <p>Username must be between 3-48 characters long</p>
          </>
        )}
      </section>
      <section className="mb-4">
        <Label forElement="signup-password" text="Password" />
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-gray-600 absolute left-1 top-3.5" />
          <input
            id="signup-password"
            className="p-3 ps-10 w-full rounded-sm border-t-0 border-x-0 bg-transparent focus:border-x-0 focus:border-t-0 focus:outline-none focus:shadow-none focus:ring-transparent"
            type="password"
            placeholder="Create a password"
            {...register("password", { pattern: patterns.password })}
          />
        </div>
        {errors.password && (
          <>
            <p>Password must include at least one lowercase, uppercase, digit and other character</p>
            <p>Password must be at least 8 characters long</p>
          </>
        )}
      </section>
      <Button
        type="submit"
        className="p-6 text-lg tracking-wider w-11/12 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 hover:opacity-100 hover:drop-shadow-xl"
      >
        SIGN UP
      </Button>
      <GoogleButton text="signup_with" />
      <Link
        to="/login"
        className="hover:underline mt-5 text-center text-gray-950 font-medium"
        data-testid="route-login-signup-form"
      >
        Already have an account? Log in.
      </Link>
    </form>
  );
};

export default SignUp;
