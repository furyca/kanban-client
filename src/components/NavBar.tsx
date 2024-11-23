import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";

const NavBar = () => {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex justify-end p-4 bg-zinc-900">
      <Link to="/" className="me-2">Home</Link>
      {user ? (
        <Link to="/dashboard" className="me-2">Dashboard</Link>
      ) : (
        <>
          <Link to="/login" className="me-2">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </div>
  );
};

export default NavBar;
