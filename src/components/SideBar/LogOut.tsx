import { ExitIcon } from "@radix-ui/react-icons";
import useModalStore from "@/store/modal/modal.store";
import { Button } from "@/components/ui/button";

const LogOut = ({ collapsed, disabled }: { collapsed: boolean; disabled: boolean }) => {
  const { setModal } = useModalStore();

  return (
    <Button
      title="Log Out"
      variant="ghost"
      className={`text-red-500 hover:bg-red-600 w-full ${collapsed ? "py-1 mx-auto mt-0 h-8" : "mt-2"}`}
      onClick={() => setModal("logout")}
      disabled={disabled}
    >
      <ExitIcon />
    </Button>
  );
};

export default LogOut;
