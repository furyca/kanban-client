import useUserStore from "@/store/userStore";
import { Outlet, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { useEffect } from "react";

const AuthRoutes = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return user ? <Dashboard /> : <Outlet />;
};

export default AuthRoutes;
