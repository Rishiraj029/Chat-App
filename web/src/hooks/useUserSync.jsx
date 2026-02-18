import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import api from "../lib/axios";

function useUserSync() {
  const { isSignedIn, getToken } = useAuth();
  const hasAttemptedRef = useRef(false);

  const {
    mutate: syncUser,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await api.post(
        "/auth/callback",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (isSignedIn && !isPending && !isSuccess && !isError && !hasAttemptedRef.current) {
      hasAttemptedRef.current = true;
      syncUser();
    }
  }, [isSignedIn, syncUser, isPending, isSuccess, isError]);

  return { isSynced: isSuccess, isSyncing: isPending };
}
export default useUserSync;