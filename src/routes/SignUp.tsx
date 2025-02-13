import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { patterns } from "../utils/patterns";
import sendPostReq from "../utils/sendPostReq";
import { Button } from "@/components/ui/button";

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
      className="flex flex-col gap-4 bg-slate-500 mt-20 mx-auto p-7 w-max text-black opacity-85 rounded-sm"
      data-testid="form-sign-up"
    >
      <h1 className="text-2xl">Sign up</h1>
      <section>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          className="p-3 w-full rounded-sm"
          type="email"
          placeholder="Email"
          {...register("email", { pattern: patterns.email })}
        />
        {errors.email && <p>Invalid email</p>}
      </section>
      <section>
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          className="p-3 w-full rounded-sm"
          type="text"
          placeholder="Username"
          {...register("username", { required: true, minLength: 3, maxLength: 48 })}
        />
        {errors.username && (
          <>
            <p>Invalid username</p>
            <p>Username must be between 3-48 characters long</p>
          </>
        )}
      </section>
      <section>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          className="p-3 w-full rounded-sm"
          type="password"
          placeholder="Create a password"
          {...register("password", { pattern: patterns.password })}
        />
        {errors.password && (
          <>
            <p>Password must include at least one lowercase, uppercase, digit and other character</p>
            <p>Password must be at least 8 characters long</p>
          </>
        )}
      </section>

      <Button type="submit" className="p-3 rounded-sm">Sign Up</Button>

      <Link to="/login" className="underline" data-testid="route-login-signup-form">
        Already have an account? Log in.
      </Link>
    </form>
  );
};

export default SignUp;