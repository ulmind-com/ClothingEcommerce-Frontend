import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import {
  clearNotifications,
  markAllRead,
  markRead,
} from "@/lib/api/notifications";
import { notificationsOptions, qk } from "@/lib/api/queries";
import { cn } from "@/lib/utils/format";

export const Route = createFileRoute("/notifications")({
  component: () => (
    <RequireAuth>
      <NotificationsPage />
    </RequireAuth>
  ),
});

function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery(notificationsOptions(true));

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: qk.notifications });
    queryClient.invalidateQueries({ queryKey: qk.unreadCount });
  };

  const readAll = useMutation({ mutationFn: markAllRead, onSuccess: refresh });
  const readOne = useMutation({ mutationFn: markRead, onSuccess: refresh });
  const clear = useMutation({
    mutationFn: clearNotifications,
    onSuccess: () => {
      refresh();
      toast.success("Notifications cleared");
    },
  });

  const unread = items.filter((n) => !n.read).length;

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[800px] px-5 pb-20 pt-24 md:px-10 md:pb-32 md:pt-32">
        <div className="eyebrow mb-3">Account</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Notifications
        </h1>

        {items.length > 0 && (
          <div className="mt-8 flex gap-6">
            {unread > 0 && (
              <button
                onClick={() => readAll.mutate()}
                className="eyebrow text-ink hover:text-champagne"
              >
                Mark all read ({unread})
              </button>
            )}
            <button
              onClick={() => clear.mutate()}
              className="eyebrow text-warm-gray hover:text-ink"
            >
              Clear all
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="mt-12 text-sm text-warm-gray">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-12 text-sm text-warm-gray">
            Nothing here yet. Order updates and new offers will show up on this
            page.
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {items.map((n) => (
              <li
                key={n.id}
                onClick={() => !n.read && readOne.mutate(n.id)}
                className={cn(
                  "cursor-pointer py-5 transition-opacity",
                  n.read && "opacity-60",
                )}
              >
                <div className="flex items-start gap-3">
                  {!n.read && (
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">{n.title}</p>
                    <p className="mt-1 text-sm text-warm-gray">{n.body}</p>
                    {n.created_at && (
                      <p className="mt-2 text-xs text-warm-gray">
                        {new Date(n.created_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteChrome>
  );
}
