interface InputInfoProps {
  error: boolean;
  currentLength: number;
  maxLength: number;
  message: string;
}

const InputInfo = ({ error, currentLength, maxLength, message }: InputInfoProps) => {
  return (
    <div className="flex justify-between items-center text-sm mt-2">
      <p className="text-red-500 font-bold">{error && message}</p>
      <p>
        {currentLength} / {maxLength}
      </p>
    </div>
  );
};

export default InputInfo;
