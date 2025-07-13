import { Outlet } from "react-router-dom";
import ModalRenderer from "@/components/Modals/ModalRenderer";
import NavBar from "@/components/Nav/NavBar";
import { useEffect, useState } from "react";

export default function Root() {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [height]);

  return (
    <div
      className={`scroll-smooth h-dvh overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-slate-300 p-0`}
    >
      <NavBar />
      <Outlet />
      <ModalRenderer />
    </div>
  );
}
