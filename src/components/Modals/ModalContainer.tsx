import { ReactNode } from "react";

const ModalContainer = ({children}: {children: ReactNode}) => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-black/90 fixed top-0">
      {children}
    </div>
  );
};

export default ModalContainer;
