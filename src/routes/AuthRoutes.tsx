import { Outlet, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

const AuthRoutes = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);
  
  return token ? <Dashboard /> : <Outlet />;
};

export default AuthRoutes;
