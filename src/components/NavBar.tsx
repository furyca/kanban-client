import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";

const NavBar = () => {
  const { user } = useUserStore();
  return (
    <nav
      className={`flex ${
        user ? "justify-between" : "justify-end"
      } items-center p-3 pt-4 bg-zinc-900/50 border-b border-zinc-700 h-12`}
    >
      {user ? (
        <>
          <Link to="/">
              <img src="/logo.png" alt="logo" className="h-9 w-20 rounded-sm" />
          </Link>

          <Link to="/dashboard" className="hover:underline underline-offset-2 text-base font-bold">
            Dashboard
          </Link>
        </>
      ) : (
        <>
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
        </>
      )}
    </nav>
  );
};

export default NavBar;
