import useModalStore from "@/store/modalStore";
import { useEffect, useRef } from "react";

const useClickOutside = () => {
  const container = useRef<HTMLFormElement | HTMLDivElement>(null);
  const { setModal } = useModalStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (container.current && !container.current.contains(e.target as Node)) {
        setModal("none");
      }
    };

    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [container]);
  return container;
};

export default useClickOutside;
