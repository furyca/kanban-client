import useModalStore from "./modal.store";

export const useActiveModal = () => useModalStore((s) => s.modal);

export const useIsModalOpen = () => useModalStore((s) => s.modal !== "none");

export const useModalProjectId = () => useModalStore((s) => s.currentProjectId);

export const useModalStatusId = () => useModalStore((s) => s.currentStatusId);

export const useModalTaskId = () => useModalStore((s) => s.currentTaskId);
