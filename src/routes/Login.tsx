import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserStore from "../store/userStore";
import sendPostReq from "../utils/sendPostReq";
import { Button } from "@/components/ui/button";

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
  useAuth({ pathname: "/login" });
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
      className="flex flex-col gap-4 bg-slate-500 mt-20 mx-auto p-7 w-max text-black opacity-85 rounded-sm"
    >
      <h1 className="text-2xl">Log in</h1>
      <section>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          className="p-3 w-full rounded-sm"
          type="text"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        {errors.email && <span>This field is required</span>}
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
          {...register("password", { required: true })}
        />
        {errors.password && <span>This field is required</span>}
      </section>

      {/* <input type="submit" className="bg-zinc-900 text-blue-50 p-3 rounded-sm cursor-pointer" value='Login'/> */}
      <Button type="submit" className="p-3 rounded-sm">Sign Up</Button>

      <Link to="/signup" className="underline">
        Don't have an account? Sign up.
      </Link>
      <Link to="" className="underline">
        Forgot your password?
      </Link>
    </form>
  );
};

export default Login;
