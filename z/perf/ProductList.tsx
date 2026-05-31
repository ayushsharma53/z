import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

function ProductList() {
  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [skip, setSkip] = useState(0);

  const limit = 5;

  const fetchProducts = async (
    currentSkip: number,
    signal: AbortSignal
  ) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${currentSkip}`,
        {
          signal,
        }
      );

      const data = await response.json();

      setProducts((prev) => [
        ...prev,
        ...data.products,
      ]);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request Cancelled");
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(skip, controller.signal);

    return () => {
      controller.abort();
    };
  }, [skip]);

  return (
    <div>
      <h2>Products</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            thumbnail={product.thumbnail}
          />
        ))}
      </div>

      <button
        onClick={() =>
          setSkip((prev) => prev + limit)
        }
      >
        Load More
      </button>
    </div>
  );
}

export default ProductList;