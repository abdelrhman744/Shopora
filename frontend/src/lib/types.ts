export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category_id: number;
  category_name: string;
  stock_quantity: number;
  in_stock: boolean;
  image_url: string;
  badge: string;
  rating: number;
  reviews_count: number;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  product_count: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type Order = {
  id: number;
  order_number: string;
  full_name: string;
  email: string;
  address: string;
  city: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

export type CartItem = {
  product: Product;
  qty: number;
};
