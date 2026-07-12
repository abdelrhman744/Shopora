"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.getProduct(productId).then(setProduct).catch(() => setNotFound(true));
  }, [productId]);

  if (notFound) {
    return <p className="text-white">Product not found.</p>;
  }
  if (!product) {
    return null;
  }
  return <ProductForm product={product} />;
}
