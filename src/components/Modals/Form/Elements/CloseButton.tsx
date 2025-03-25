import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modalStore";
import useTaskStore from "@/store/taskStore";

const CloseButton = () => {
  const { setModal } = useModalStore();
  const { setActiveTask } = useTaskStore();

  const handleModalClose = () => {
    setModal("none");
    setActiveTask(null);
  }

  return (
    <Button variant="destructive" className="h-8 w-8 p-2 absolute right-8 top-8" onClick={handleModalClose}>
      X
    </Button>
  );
};

export default CloseButton;
