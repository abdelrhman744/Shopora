import type {
  AuthResponse,
  Category,
  Order,
  Product,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  fields?: { field: string; message: string }[];

  constructor(message: string, status: number, fields?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("shopora_token");
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
  };

  const isFormData = rest.body instanceof FormData;
  if (!isFormData && rest.body) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    let fields: { field: string; message: string }[] | undefined;
    if (data?.detail) {
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        fields = data.detail;
        message = data.detail.map((d: any) => d.message).join(", ");
      }
    }
    throw new ApiError(message, res.status, fields);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request<any>("/api/auth/me", { auth: true }),

  // Products
  listProducts: (params: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
    page?: number;
    page_size?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    return request<{ items: Product[]; total: number }>(
      `/api/products?${qs.toString()}`
    );
  },

  getProduct: (id: number) => request<Product>(`/api/products/${id}`),

  createProduct: (payload: Partial<Product> & { name: string; price: number; category_id: number }) =>
    request<Product>("/api/products", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  updateProduct: (id: number, payload: Partial<Product>) =>
    request<Product>(`/api/products/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),

  deleteProduct: (id: number) =>
    request<void>(`/api/products/${id}`, { method: "DELETE", auth: true }),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ image_url: string }>("/api/products/upload-image", {
      method: "POST",
      auth: true,
      body: formData,
    });
  },

  // Categories
  listCategories: () => request<Category[]>("/api/categories"),

  createCategory: (payload: { name: string; icon: string }) =>
    request<Category>("/api/categories", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  updateCategory: (id: number, payload: { name?: string; icon?: string }) =>
    request<Category>(`/api/categories/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),

  deleteCategory: (id: number) =>
    request<void>(`/api/categories/${id}`, { method: "DELETE", auth: true }),

  // Orders
  createOrder: (payload: {
    full_name: string;
    email: string;
    address: string;
    city: string;
    items: { product_id: number; quantity: number }[];
  }) =>
    request<Order>("/api/orders", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  listMyOrders: () => request<Order[]>("/api/orders", { auth: true }),
};
