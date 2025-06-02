import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modalStore";
import useTaskStore from "@/store/taskStore";
import { Cross1Icon } from "@radix-ui/react-icons";

const CloseButton = () => {
  const { setModal } = useModalStore();
  const { setActiveTask } = useTaskStore();

  const handleModalClose = () => {
    setModal("none");
    setActiveTask(null);
  }

  return (
    <Button type="button" className="h-10 w-10 text-xl shadow-none text-slate-300 bg-transparent hover:bg-black/10 absolute right-1 top-1" onClick={handleModalClose}>
      <Cross1Icon className="w-8 h-8" />
    </Button>
  );
};

export default CloseButton;
