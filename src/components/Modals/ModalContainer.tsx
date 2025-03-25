import useModalStore from "@/store/modalStore";
import { ReactNode, useEffect } from "react";

const ModalContainer = ({ children }: { children: ReactNode }) => {
  const { setModal } = useModalStore();

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setModal("none");
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full bg-black/90 fixed top-0 z-[2]">
      {children}
    </div>
  );
};

export default ModalContainer;
