import { ExitIcon } from "@radix-ui/react-icons";
import useModalStore from "@/store/modalStore";
import { Button } from "@/components/ui/button";

const LogOut = () => {
  const { setModal } = useModalStore();

  return (
    <Button variant="ghost" className="mt-2 text-red-500 hover:bg-red-600" onClick={() => setModal("logout")}>
      <ExitIcon />
    </Button>
  );
};

export default LogOut;
