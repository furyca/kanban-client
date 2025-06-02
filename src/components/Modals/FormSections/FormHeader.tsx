import CloseButton from "../FormElements/CloseButton";

const FormHeader = ({text}: {text: string}) => {
  return (
    <div className="relative pt-8">
      <h1 className="text-2xl text-center font-bold">{text}</h1>
      <CloseButton />
    </div>
  );
};

export default FormHeader;
