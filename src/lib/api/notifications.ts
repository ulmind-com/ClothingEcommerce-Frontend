import { del, get, patch, post } from "./client";
import type { AppNotification } from "@/types/api";

export const fetchNotifications = (limit = 20, skip = 0) =>
  get<AppNotification[]>("/notifications", { limit, skip });

export const fetchUnreadCount = () =>
  get<{ count: number }>("/notifications/unread-count");

export const markAllRead = () => post<{ ok: boolean }>("/notifications/read-all");

export const markRead = (id: string) =>
  patch<{ ok: boolean }>(`/notifications/${id}/read`);

export const clearNotifications = () => del<{ ok: boolean }>("/notifications");
