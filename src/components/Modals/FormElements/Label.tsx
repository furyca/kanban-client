interface LabelProps {
  text: string;
  forElement: string;
}

const Label = ({ text, forElement }: LabelProps) => {
  return (
    <label htmlFor={forElement} className="block mb-2 ms-1 font-medium text-sm md:text-base">
      {text}
    </label>
  );
};

export default Label;
