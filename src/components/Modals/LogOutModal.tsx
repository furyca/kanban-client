import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import useUserStore from "@/store/userStore";
import useModalStore from "@/store/modalStore";
import sendPostReq from "@/utils/sendPostReq";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef } from "react";
import useProjectStore from "@/store/projectStore";

const LogOutModal = () => {
  const navigate = useNavigate();
  const { clearUser } = useUserStore();
  const { setModal } = useModalStore();
  const { setSelectedProject } = useProjectStore();
  const ref = useClickOutside();

  const handleLogout = async () => {
    const json = await sendPostReq({
      path: "/logout",
      opts: { method: "POST", credentials: "include" },
    });

    clearUser();
    setSelectedProject(null);
    setModal("none");
    json.redirect && navigate(json.redirect);
  };

  return (
    <div
      ref={ref as LegacyRef<HTMLDivElement>}
      className="flex flex-col justify-between text-center rounded-lg h-72 w-96 bg-gray-950 border-2 text-slate-200 p-8 shadow-card"
    >
      <h2 className="block mb-2 font-bold text-3xl">Log Out?</h2>
      <div className="flex justify-between">
        <Button className="w-20 h-12" onClick={() => setModal("none")}>
          NO
        </Button>
        <Button className="bg-red-600 w-20 h-12" onClick={handleLogout}>
          YES
        </Button>
      </div>
    </div>
  );
};

export default LogOutModal;
