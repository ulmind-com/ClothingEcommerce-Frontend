import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { get } from "./client";
import type {
  Banner,
  Category,
  HomeSection,
  Product,
  Review,
  ReviewSummary,
  Settings,
} from "@/types/api";

export const qk = {
  banners: ["banners"] as const,
  categories: ["categories"] as const,
  categoryTree: ["categories", "tree"] as const,
  homeSections: ["home-sections", "resolved"] as const,
  settings: ["settings"] as const,
  trending: ["search", "trending"] as const,
  recsHome: (limit: number) => ["recs", "home", limit] as const,
  recsSimilar: (id: string, limit: number) =>
    ["recs", "similar", id, limit] as const,
  products: (params: Record<string, unknown>) =>
    ["products", params] as const,
  product: (id: string) => ["products", id] as const,
  reviews: (id: string) => ["reviews", id] as const,
  reviewSummary: (id: string) => ["reviews", "summary", id] as const,
  wishlistIds: ["wishlist", "ids"] as const,
  me: ["auth", "me"] as const,
};

export const bannersOptions = () =>
  queryOptions({
    queryKey: qk.banners,
    queryFn: () => get<Banner[]>("/banners"),
    staleTime: 60_000,
  });

export const categoriesOptions = () =>
  queryOptions({
    queryKey: qk.categories,
    queryFn: () => get<Category[]>("/categories"),
    staleTime: 5 * 60_000,
  });

export const homeSectionsOptions = () =>
  queryOptions({
    queryKey: qk.homeSections,
    queryFn: () => get<HomeSection[]>("/home-sections/resolved"),
    staleTime: 60_000,
  });

export const settingsOptions = () =>
  queryOptions({
    queryKey: qk.settings,
    queryFn: () => get<Settings>("/settings"),
    staleTime: 10 * 60_000,
  });

export const recsHomeOptions = (limit = 12) =>
  queryOptions({
    queryKey: qk.recsHome(limit),
    queryFn: () => get<Product[]>("/recommendations/home", { limit }),
    staleTime: 60_000,
  });

export const recsSimilarOptions = (id: string, limit = 8) =>
  queryOptions({
    queryKey: qk.recsSimilar(id, limit),
    queryFn: () =>
      get<Product[]>(`/recommendations/similar/${id}`, { limit }),
    staleTime: 60_000,
  });

export interface ProductListParams {
  category_id?: string;
  q?: string;
  limit?: number;
  skip?: number;
}

export const productsOptions = (params: ProductListParams = {}) =>
  queryOptions({
    queryKey: qk.products(params),
    queryFn: () => get<Product[]>("/products", { ...params }),
    staleTime: 30_000,
  });

export const productOptions = (id: string) =>
  queryOptions({
    queryKey: qk.product(id),
    queryFn: () => get<Product>(`/products/${id}`),
    staleTime: 30_000,
  });

export const reviewsOptions = (productId: string) =>
  queryOptions({
    queryKey: qk.reviews(productId),
    queryFn: () =>
      get<Review[]>("/reviews", { product_id: productId }),
    staleTime: 60_000,
  });

export const reviewSummaryOptions = (productId: string) =>
  queryOptions({
    queryKey: qk.reviewSummary(productId),
    queryFn: () =>
      get<ReviewSummary>("/reviews/summary", { product_id: productId }),
    staleTime: 60_000,
  });

export const productsInfiniteOptions = (
  params: Omit<ProductListParams, "skip"> & { pageSize?: number } = {},
) => {
  const pageSize = params.pageSize ?? 24;
  return infiniteQueryOptions({
    queryKey: ["products", "infinite", params] as const,
    queryFn: ({ pageParam = 0 }) =>
      get<Product[]>("/products", {
        ...(params as Record<string, unknown>),
        limit: pageSize,
        skip: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (last, pages) =>
      last.length < pageSize ? undefined : pages.length * pageSize,
    staleTime: 30_000,
  });
};