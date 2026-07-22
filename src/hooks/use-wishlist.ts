import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { del, post } from "@/lib/api/client";
import { qk, wishlistIdsOptions } from "@/lib/api/queries";
import { useAuth } from "@/lib/auth/store";

/**
 * Wishlist membership + a toggle. Signed-out visitors are sent to /login
 * rather than firing a request the backend will reject.
 */
export function useWishlist() {
  const signedIn = useAuth((s) => Boolean(s.token));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery(wishlistIdsOptions(signedIn));
  const ids = data?.ids ?? [];

  const toggle = useMutation({
    mutationFn: ({ id, on }: { id: string; on: boolean }) =>
      on ? post(`/wishlist/${id}`) : del(`/wishlist/${id}`),
    onMutate: async ({ id, on }) => {
      await queryClient.cancelQueries({ queryKey: qk.wishlistIds });
      const prev = queryClient.getQueryData<{ ids: string[] }>(qk.wishlistIds);
      queryClient.setQueryData<{ ids: string[] }>(qk.wishlistIds, (old) => {
        const current = old?.ids ?? [];
        return {
          ids: on ? [...current, id] : current.filter((x) => x !== id),
        };
      });
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(qk.wishlistIds, ctx.prev);
      toast.error(err instanceof Error ? err.message : "Could not update");
    },
    onSuccess: (_data, { on }) => {
      toast.success(on ? "Added to wishlist" : "Removed from wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qk.wishlist });
      queryClient.invalidateQueries({ queryKey: qk.wishlistIds });
    },
  });

  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => {
      if (!signedIn) {
        toast("Sign in to save pieces");
        navigate({ to: "/login", search: { redirect: undefined } });
        return;
      }
      toggle.mutate({ id, on: !ids.includes(id) });
    },
    pending: toggle.isPending,
  };
}
