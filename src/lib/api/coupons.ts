import { get, post } from "./client";
import type { ApplicableCoupons, Coupon } from "@/types/api";

/** Public offers wall. Hides first-order-only coupons from returning users. */
export const fetchActiveCoupons = () => get<Coupon[]>("/coupons/active");

/** Ranked coupons for a cart subtotal, with locked ones and `best_code`. */
export const fetchApplicableCoupons = (subtotal: number) =>
  post<ApplicableCoupons>("/coupons/applicable", { subtotal });

export const validateCoupon = (code: string, subtotal: number) =>
  post<{
    valid: boolean;
    discount: number;
    code?: string;
    /** Always set — the success line, or why it was rejected. */
    message: string;
  }>("/coupons/validate", { code, subtotal });
