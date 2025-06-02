import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface InputInfoProps {
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  currentLength: number;
  maxLength: number;
  message: string;
}

const InputInfo = ({ currentLength, maxLength, message, error }: InputInfoProps) => {
  return (
    <div className="flex w-full justify-between items-center text-sm px-1">
      <p className="text-red-500 font-bold">{error && message}</p>
      <p>
        {currentLength} / {maxLength}
      </p>
    </div>
  );
};

export default InputInfo;
