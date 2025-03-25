import CloseButton from "../Elements/CloseButton";

const FormHeader = ({text}: {text: string}) => {
  return (
    <div className="relative p-8">
      <h1 className="text-2xl text-center font-bold">{text}</h1>
      <CloseButton />
    </div>
  );
};

export default FormHeader;
