import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal/modal.store";
import { Cross1Icon } from "@radix-ui/react-icons";

const CloseButton = () => {
  const clearContext = useModalStore((state) => state.clearContext);

  return (
    <Button
      type="button"
      className="h-10 w-10 text-xl shadow-none text-slate-300 bg-transparent hover:bg-black/10 absolute right-1 top-1"
      onClick={clearContext}
    >
      <Cross1Icon className="w-8 h-8" />
    </Button>
  );
};

export default CloseButton;
