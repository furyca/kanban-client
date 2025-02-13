const Label = ({ text, forElement }: { text: string; forElement: string }) => {
  return (
    <label htmlFor={forElement} className="block mb-2 font-medium">
      {text}
    </label>
  );
};

export default Label;
