import { Button } from "./ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import useModalStore from "@/store/modalStore";

const LogOut = () => {
  const { setModal } = useModalStore();

  return (
    <Button variant="ghost" className="mb-2 text-red-500" onClick={() => setModal("logout")}>
      <ExitIcon />
    </Button>
  );
};

export default LogOut;
