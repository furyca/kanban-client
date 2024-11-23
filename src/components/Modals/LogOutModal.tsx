import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import useUserStore from "@/store/userStore";
import useModalStore from "@/store/modalStore";
import sendPostReq from "@/utils/sendPostReq";

const LogOutModal = () => {
  const navigate = useNavigate();
  const { clearUser } = useUserStore();
  const { setModal } = useModalStore();

  const handleLogout = async () => {
    const json = await sendPostReq({
      path: "/logout",
      opts: { method: "POST", credentials: "include" },
    });

    clearUser();
    setModal("none");
    json.redirect && navigate(json.redirect);
  };

  return (
    <div className="flex flex-col gap-4 rounded-sm bg-slate-500 p-8">
      <h2 className="text-center">Log Out?</h2>
      <div className="flex justify-between gap-4">
        <Button onClick={() => setModal("none")}>NO</Button>
        <Button className="bg-red-600" onClick={handleLogout}>YES</Button>
      </div>
    </div>
  );
};

export default LogOutModal;
