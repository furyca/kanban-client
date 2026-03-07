import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/auth/auth.store";

const ProtectedRoutes = () => {
  const { accessToken } = useAuthStore();

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;

};

export default ProtectedRoutes;
