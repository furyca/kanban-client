import { ModalState } from "@/store/modal/modal.store";

export type Lookup = {
  [key in ModalState]: JSX.Element | null;
};
