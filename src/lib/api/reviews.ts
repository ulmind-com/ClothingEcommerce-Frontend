import { get, post } from "./client";
import type { Review } from "@/types/api";

/** Mirrors ALLOWED_TAGS in app/routers/reviews.py — others are dropped server-side. */
export const REVIEW_TAGS = ["Quality", "Material", "Fit", "Design"] as const;

export interface CanReview {
  can: boolean;
  /** They've had this product delivered on some order. */
  delivered: boolean;
  /** They've already left a review for it. */
  already: boolean;
}

export const fetchCanReview = (productId: string) =>
  get<CanReview>("/reviews/can-review", { product_id: productId });

export const createReview = (body: {
  product_id: string;
  rating: number;
  title?: string;
  text?: string;
  tags?: string[];
}) => post<Review>("/reviews", body);

export const voteReview = (reviewId: string, helpful: boolean) =>
  post<{ helpful: number; unhelpful: number }>(`/reviews/${reviewId}/vote`, {
    helpful,
  });
