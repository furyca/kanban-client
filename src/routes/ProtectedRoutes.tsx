import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

const ProtectedRoutes = () => {
  const { token, checkAuth, isAuthChecked } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthChecked) return null; // loading

  return token ? <Outlet /> : <Navigate to="/login" replace />;

};

export default ProtectedRoutes;
