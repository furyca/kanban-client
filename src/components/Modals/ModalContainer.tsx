import { ReactNode } from "react";

const ModalContainer = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-center items-center w-full h-full bg-black/80 fixed top-0 z-[2]">{children}</div>;
};

export default ModalContainer;
