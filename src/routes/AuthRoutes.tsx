import { Outlet, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import useAuthStore from "@/store/auth/auth.store";
import { useEffect } from "react";

const AuthRoutes = () => {
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken, navigate]);
  
  return accessToken ? <Dashboard /> : <Outlet />;
};

export default AuthRoutes;
