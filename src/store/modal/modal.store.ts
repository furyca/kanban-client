import { create } from "zustand";
import useAuthStore from "../auth/auth.store";
import useProjectStore from "../projects/project.store";

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
  | "remove_status";

interface ModalStore {
  modal: ModalState;
  currentProjectId: string | null;
  currentStatusId: string | null;
  currentTaskId: string | null;

  setModal: (newModal: ModalState) => void;
  setCurrentProjectId: (id: string | null) => void;
  setCurrentStatusId: (id: string | null) => void;
  setCurrentTaskId: (id: string | null) => void;

  clearContext: () => void;
}

useAuthStore.subscribe((state) => {
  const implementation = useProjectStore.getState().impl.implementation;
  if (!state.user && implementation !== "local") {
    useProjectStore.getState().clearAll();
  }
});

const useModalStore = create<ModalStore>()((set) => ({
  modal: "none",
  currentProjectId: null,
  currentStatusId: null,
  currentTaskId: null,

  setModal: (newModal) => set({ modal: newModal }),
  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  setCurrentStatusId: (id) => set({ currentStatusId: id }),
  setCurrentTaskId: (id) => set({ currentTaskId: id }),

  clearContext: () =>
    set({
      currentProjectId: null,
      currentStatusId: null,
      currentTaskId: null,
      modal: "none",
    }),
}));

export default useModalStore;