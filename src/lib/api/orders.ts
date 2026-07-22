import { get, post } from "./client";
import type {
  Address,
  Bill,
  CodAvailability,
  CreateOrderResponse,
  Order,
  OrderItemIn,
} from "@/types/api";

export interface OrderDraft {
  items: OrderItemIn[];
  address: Address;
  payment_method: "online" | "cod";
  coupon_code?: string | null;
}

/** Preview delivery/tax/total before committing. Same body as create. */
export const quoteOrder = (draft: OrderDraft) =>
  post<Bill>("/orders/quote", draft);

export const createOrder = (draft: OrderDraft) =>
  post<CreateOrderResponse>("/orders", draft);

/** Hands Razorpay's signed handler payload back for server-side verification. */
export const verifyPayment = (body: {
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => post<{ status: string; order_id: string }>("/orders/verify", body);

export const cancelOrder = (orderId: string) =>
  post<{ status: string; refund: boolean }>(`/orders/${orderId}/cancel`);

export const fetchOrders = () => get<Order[]>("/orders");

export const fetchOrder = (orderId: string) => get<Order>(`/orders/${orderId}`);

export const fetchCodAvailability = () =>
  get<CodAvailability>("/orders/cod-availability");
