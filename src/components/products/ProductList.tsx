import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Product } from "../../types";
import { fetchProducts } from "../../data/mockData";

interface ProductListProps {
  onOrder: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onOrder }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const newProducts = await fetchProducts(page);
        setProducts((prev) => [...prev, ...newProducts]);
        setHasMore(newProducts.length === 10);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 gap-4"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          ref={index === products.length - 1 ? lastProductRef : null}
          layout
          className="group relative overflow-hidden rounded-lg border bg-surface p-3 transition-shadow hover:shadow-lg dark:bg-surface-dark"
        >
          <div className="flex gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-md">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {product.supermarket}
                  </p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:text-primary-dark flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    {product.discount}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <span className="text-xs line-through text-muted-foreground">
                    {product.originalPrice} FCFA
                  </span>
                  <span className="text-sm font-bold text-primary dark:text-primary-dark">
                    {product.clearancePrice} FCFA
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Expire le: {product.expiryDate}
                </p>
              </div>
            </div>
          </div>
          <Button
            className="mt-2 w-full"
            size="sm"
            onClick={() => onOrder(product)}
          >
            Commander
          </Button>
        </motion.div>
      ))}
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;
