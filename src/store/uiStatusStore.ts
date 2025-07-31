import { create } from "zustand";

interface UIStatusStore {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const useUIStatusStore = create<UIStatusStore>()((set) => ({
  loading: false,
  setLoading: (isLoading: boolean) => set(() => ({ loading: isLoading })),
}));

export default useUIStatusStore;
