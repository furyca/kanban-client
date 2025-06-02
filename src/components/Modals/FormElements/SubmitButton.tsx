import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface SubmitButtonProps {
  id: string;
  text: string;
  loading: boolean;
}
const SubmitButton = ({ id, text, loading }: SubmitButtonProps) => {
  return (
    <div className="sticky bottom-0 bg-inherit w-full p-1 pt-0 mt-auto">
      <Button
        type="submit"
        autoFocus
        className="p-6 text-lg text-slate-300 bg-zinc-900 hover:bg-zinc-950 hover:opacity-90 transition-all duration-300 font-bold mt-auto w-full"
        data-testid={id}
        disabled={loading}
      >
        {loading && <LoaderCircle className="animate-spin" /> }
        {text}
      </Button>
    </div>
  );
};

export default SubmitButton;
