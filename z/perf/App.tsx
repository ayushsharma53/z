import { lazy, Suspense, useState } from "react";

const ProductList = lazy(() => import("./ProductList"));

function App() {
  const [showProducts, setShowProducts] = useState(false);

  return (
    <div>
      <h1>Performance Optimization Demo</h1>

      <button
        onClick={() => setShowProducts(true)}
      >
        Show Products
      </button>

      {showProducts && (
        <Suspense fallback={<h2>Loading Products...</h2>}>
          <ProductList />
        </Suspense>
      )}
    </div>
  );
}

export default App;