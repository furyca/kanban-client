import useAuthStore from "@/store/authStore";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { token } = useAuthStore();

  return (
    <nav className="flex justify-between items-center p-3 bg-zinc-900/50 border-b border-zinc-700 h-12">
      <div className="flex gap-8 items-center">
        <Link to="/">
          <img src="/logo.png" alt="logo" className="h-8 w-20 rounded-sm" title="Home" />
        </Link>
        {/* {user && <span className="hidden sm:block text-sm font-bold text-slate-300">{user.username}</span>} */}
      </div>
      {token ? (
        <Link to="/dashboard" className="hover:underline underline-offset-2 text-base font-bold">
          Dashboard
        </Link>
      ) : (
        <div>
          <Link
            to="/login"
            className="me-2 hover:underline underline-offset-2 text-base font-bold"
            data-testid="route-log-in"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="hover:underline underline-offset-2 text-base font-bold"
            data-testid="route-sign-up"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
