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

export interface Me {
  id: ID;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  role?: string;
  [k: string]: unknown;
}