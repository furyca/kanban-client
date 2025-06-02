import useUserStore from "@/store/userStore";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useUserStore();
  return (
    <div className="flex flex-col items-center gap-6 pt-20 h-full w-2/5 mx-auto">
      <img className="rounded ms-1 w-80 lg:w-full" src="/logo.png" alt="logo.png" />
      {user ? (
        <Link
          to="/dashboard"
          className="flex justify-center items-center font-bold tracking-wider rounded-full h-14 w-72 text-zinc-800 bg-blue-300/70 hover:bg-blue-500/70 text-lg transition-all duration-300"
        >
          Dashboard -&gt;
        </Link>
      ) : (
        <div className="flex justify-evenly items-center w-full">
          <Link
            to="/signup"
            className="flex justify-center items-center font-bold tracking-wider rounded-full h-12 w-60 text-zinc-300 bg-indigo-500 hover:bg-indigo-800"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="flex justify-center items-center font-bold tracking-wider rounded-full h-12 w-60 text-zinc-300 bg-indigo-600 hover:bg-indigo-900 text-lg"
          >
            Login
          </Link>
        </div>
      )}

      {/* <ul className="text-base p-0 font-semibold list-item italic">
        <li className="mb-1 list-disc">Transform your ideas into reality with Kanban.</li>
        <li className="mb-1 list-disc">A simple and intuitive Kanban board to manage your tasks and projects.</li>
        <li className="mb-1 list-disc">Collaborate with your team and stay organized.</li>
      </ul> */}
    </div>
  );
};

export default Home;
