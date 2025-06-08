import { Outlet, useNavigate } from "react-router-dom";
import Login from "./Login";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

const ProtectedRoutes = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return token ? <Outlet /> : <Login />;
};

export default ProtectedRoutes;
