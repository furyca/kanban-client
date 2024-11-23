import { ModalState } from "@/store/modalStore";

export type Lookup = {
  [key in ModalState]: JSX.Element | null;
};
