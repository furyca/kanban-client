import useModalStore from "@/store/modal/modal.store";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/auth/auth.store";
import { googleLogout } from "@react-oauth/google";

const LogOutModal = () => {
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loadingAuth);
  const clearContext = useModalStore((s) => s.clearContext);
  const ref = useClickOutside();

  const handleLogout = async () => {
    googleLogout();
    logout();
    clearContext();
  };

  return (
    <div
      ref={ref as LegacyRef<HTMLDivElement>}
      className="flex flex-col justify-between rounded-lg w-60 md:w-96 bg-gray-950 border border-slate-400 text-slate-200 px-2 py-4 shadow-card"
    >
      <section className="relative p-2">
        <h2 className="block font-bold text-xl">Log Out?</h2>
      </section>
      <div className="flex justify-end gap-2 mt-auto pt-4 px-4 text-center">
        <Button
          className="h-10 w-24 bg-zinc-800 hover:bg-zinc-900 text-base rounded-lg"
          onClick={() => clearContext()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="h-10 w-24 bg-red-600 hover:bg-red-800 text-base font-bold tracking-wide rounded-lg"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Log out
        </Button>
      </div>
    </div>
  );
};

export default LogOutModal;
