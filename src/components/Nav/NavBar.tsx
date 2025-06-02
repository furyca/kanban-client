import useUserStore from "@/store/userStore";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { user } = useUserStore();

  return (
    <nav className="flex justify-between items-center p-3 bg-zinc-900/50 border-b border-zinc-700 h-12">
      <Link to="/">
        <img src="/logo.png" alt="logo" className="h-8 w-20 rounded-sm" />
      </Link>
      {user ? (
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
