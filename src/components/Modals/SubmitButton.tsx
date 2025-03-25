import { Button } from "../ui/button";

interface SubmitButtonProps {
  id: string;
  text: string;
}
const SubmitButton = ({ id, text }: SubmitButtonProps) => {
  return (
    <div className="sticky bottom-0 bg-gray-950 w-full p-2">
      <Button
        type="submit"
        className="p-6 text-stone-900 hover:text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-all duration-300 font-bold text-base mt-auto w-full"
        data-testid={id}
      >
        {text}
      </Button>
    </div>
  );
};

export default SubmitButton;
