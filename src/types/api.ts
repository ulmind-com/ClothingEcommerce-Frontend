// Types mirror the live backend at
// https://clothingecommerce-backend.onrender.com (permissive — endpoints
// return untyped JSON in OpenAPI).

export type ID = string;

export interface SizeVariant {
  size: string;
  price: number | null;
  mrp: number | null;
  discount_pct: number | null;
  discount_on: string | null;
  stock: number;
}

export interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
  price: number | null;
  mrp: number | null;
  discount_pct: number | null;
  discount_on: string | null;
  stock: number;
  sizes?: SizeVariant[];
}

export interface Product {
  id: ID;
  title: string;
  description?: string;
  brand?: string | null;
  category_id?: ID | null;
  mrp: number;
  price: number;
  discount_pct?: number;
  discount_on?: string;
  images?: string[];
  colors?: ColorVariant[];
  sizes?: string[];
  stock?: number;
  active?: boolean;
  rating?: number;
  rating_count?: number;
  created_at?: string;
  [k: string]: unknown;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  parent_id: ID | null;
  image: string | null;
  image_scale?: number;
  order: number;
}

export interface Banner {
  id: ID;
  image: string;
  title: string;
  subtitle: string;
  code: string;
  active: boolean;
  order: number;
  created_at?: string;
}

export interface HomeSection {
  id: ID;
  title: string;
  type: string;
  layout: string;
  products?: Product[];
  category_id?: ID | null;
  limit: number;
  order: number;
  active: boolean;
}

export interface Review {
  id: ID;
  product_id: ID;
  user_id?: ID;
  user_name?: string;
  rating: number;
  title?: string;
  text?: string;
  photos?: string[];
  tags?: string[];
  created_at?: string;
  [k: string]: unknown;
}

export interface ReviewSummary {
  count: number;
  average: number;
  breakdown?: Record<string, number>;
  [k: string]: unknown;
}

export interface Settings {
  currency: string;
  currency_code: string;
  tax_rate: number;
  cancel_window_hours: number;
  return_window_days: number;
  cod?: {
    enabled: boolean;
    disabled_from?: string | null;
    disabled_until?: string | null;
  };
  delivery?: {
    free_radius_km: number;
    per_km_rate: number;
    base_fee: number;
    free_above: number;
    max_service_km: number;
    slabs?: Array<{ up_to_km: number; fee: number }>;
  };
  shop: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    state?: string;
    lat?: number;
    lng?: number;
  };
  [k: string]: unknown;
}

/** Mirrors the backend's UserPublic (app/models/user.py). */
export interface Me {
  id: ID;
  name?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  role?: string;
  [k: string]: unknown;
}

export interface AuthResponse {
  access_token: string;
  user: Me;
}

export interface OtpRequestResponse {
  ok: boolean;
  message: string;
  resend_in: number;
}

export interface OtpVerifyResponse {
  verified: boolean;
  signup_token: string;
}

export interface Wishlist {
  ids: ID[];
  products: Product[];
}

/** Mirrors app/models/order.py Address. */
export interface Address {
  tag: string;
  name: string;
  house: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  lat?: number | null;
  lng?: number | null;
}

export interface OrderItemIn {
  product_id: ID;
  qty: number;
  color?: string | null;
  size?: string | null;
}

export interface GstItem {
  title: string;
  qty: number;
  rate: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxable: number;
  tax: number;
}

/** The computed bill from POST /orders/quote (and echoed on every order). */
export interface Bill {
  subtotal: number;
  discount: number;
  delivery: number;
  delivery_free: boolean;
  distance_km: number | null;
  deliverable: boolean;
  tax: number;
  gst: {
    total: number;
    interstate: boolean;
    cgst: number;
    sgst: number;
    igst: number;
    items: GstItem[];
  };
  total: number;
  currency: string;
  currency_code: string;
  coupon_applied: boolean;
}

export interface OrderItem {
  product_id: ID;
  title: string;
  price: number;
  qty: number;
  color?: string | null;
  size?: string | null;
  image?: string | null;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order extends Partial<Bill> {
  id: ID;
  user_id: ID;
  items: OrderItem[];
  address: Address;
  payment_method: "cod" | "online";
  coupon_code?: string | null;
  amount: number;
  status: OrderStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  refund_id?: string | null;
  refund_status?: "initiated" | "failed" | null;
  created_at?: string;
  paid_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  [k: string]: unknown;
}

/** POST /orders response — COD returns the short form, online carries Razorpay. */
export interface CreateOrderResponse {
  order_id: ID;
  payment_method: "cod" | "online";
  status?: string;
  bill: Bill;
  razorpay_order_id?: string;
  amount?: number;
  currency?: string;
  key_id?: string;
  prefill?: { name: string; contact: string; email: string };
}

export interface CodAvailability {
  available: boolean;
  reason?: string;
  [k: string]: unknown;
}

export interface Offer {
  code: string;
  type: "percent" | "flat";
  value: number;
  min_order: number;
  max_discount: number;
  description: string;
  first_order_only: boolean;
  applicable: boolean;
  discount: number;
  needed_more: number;
}

export interface ApplicableCoupons {
  offers: Offer[];
  best_code: string | null;
  best_discount: number;
}

export interface Coupon {
  id: ID;
  code: string;
  type: "percent" | "flat";
  value: number;
  min_order: number;
  max_discount: number;
  active: boolean;
  first_order_only: boolean;
  valid_from?: string | null;
  valid_until?: string | null;
  description: string;
}

export type ReturnStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "picked_up"
  | "refunded"
  | "exchanged";

export interface ReturnRequest {
  id: ID;
  order_id: ID;
  order_short: string;
  type: "refund" | "exchange";
  reason: string;
  note: string;
  items: OrderItem[];
  amount: number;
  status: ReturnStatus;
  admin_note?: string;
  refund_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppNotification {
  id: ID;
  title: string;
  body: string;
  read: boolean;
  kind?: string;
  data?: Record<string, unknown>;
  created_at?: string;
}
