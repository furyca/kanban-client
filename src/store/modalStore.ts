import { create } from "zustand";

export type ModalState =
  | "none"
  | "delete_project"
  | "create_project"
  | "update_project"
  | "delete_task"
  | "create_task"
  | "update_task"
  | "logout"
  | "add_status"
  | "remove_status"

interface ModalStore {
  modal: ModalState;
  setModal: (newModal: ModalState) => void;
}

const useModalStore = create<ModalStore>()((set) => ({
  modal: "none",
  setModal: (newModal: ModalState) => set(() => ({ modal: newModal })),
}));

export default useModalStore;
