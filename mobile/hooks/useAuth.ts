import { useApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query"

export const useAuthCallback = () => {
  const Api = useApi();

  return useMutation({
    mutationFn: async() => {
      const { data } = await Api.post("/auth/callback")
      return data
    }
  })

}