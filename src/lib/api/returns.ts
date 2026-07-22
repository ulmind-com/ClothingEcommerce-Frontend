import { get, post } from "./client";
import type { OrderItemIn, ReturnRequest } from "@/types/api";

export interface ReturnDraft {
  order_id: string;
  type: "refund" | "exchange";
  reason: string;
  /** For an exchange: the size/colour they want instead. */
  note: string;
  items: OrderItemIn[];
}

export const createReturn = (draft: ReturnDraft) =>
  post<ReturnRequest>("/returns", draft);

export const fetchReturns = () => get<ReturnRequest[]>("/returns");
