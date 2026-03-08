import { Outlet } from "react-router-dom";
import ModalRenderer from "@/components/Modals/ModalRenderer";
import NavBar from "@/components/Nav/NavBar";
import { useEffect } from "react";
import useAuthStore from "@/store/auth/auth.store";

export default function Root() {
  const checkAuth = useAuthStore(s => s.checkAuth);
  const isAuthChecked = useAuthStore(s => s.isAuthChecked);

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthChecked) return null

  return (
    <div className="scroll-smooth h-dvh flex flex-col overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-slate-300 p-0">
      <NavBar />
      <Outlet />
      <ModalRenderer />
    </div>
  );
}
