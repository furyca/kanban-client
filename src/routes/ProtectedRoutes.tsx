import useUserStore from "@/store/userStore";
import { Outlet, useNavigate } from "react-router-dom";
import Login from "./Login";
import { useEffect } from "react";

const ProtectedRoutes = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? <Outlet /> : <Login />;
};

export default ProtectedRoutes;
