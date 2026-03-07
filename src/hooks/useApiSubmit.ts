import { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import useAuthStore from "@/store/auth/auth.store";
import { apiFetch } from "@/utils/apiClient";

export type UseApiSubmitParams<T extends FieldValues> = {
  url: string;
  method: string;
  buildBody: (data: T) => any;
  onSuccess?: (response: Response) => void;
  onFinally?: () => void;
};

export function useApiSubmit<T extends FieldValues>({
  url,
  method,
  buildBody,
  onSuccess,
  onFinally,
}: UseApiSubmitParams<T>) {
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Response | null>(null);
  const { accessToken } = useAuthStore();

  const onSubmit: SubmitHandler<T> = async (data) => {
    setLoading(true);

    try {
      const response = await apiFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(buildBody(data)),
      });

      setRes(response);
      onSuccess?.(response);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
      onFinally?.();
    }
  };

  return { onSubmit, loading, res };
}
