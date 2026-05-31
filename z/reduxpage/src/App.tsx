import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import {
  cachePage,
  setCurrentPage,
  setFilteredProducts,
} from "./features/productSlice";

const LIMIT = 5;

function App() {
  const dispatch = useDispatch();

  const {
    pages,
    currentPage,
    totalPages,
    filteredProducts,
  } = useSelector(
    (state: RootState) => state.product
  );

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const fetchPage = async (page: number) => {
    const res = await axios.get(
      `http://localhost:5000/products?page=${page}&limit=${LIMIT}`
    );

    dispatch(
      cachePage({
        page,
        products: res.data.products,
        totalPages: res.data.totalPages,
      })
    );
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const nextPage = async () => {
    const next = currentPage + 1;

    if (next > totalPages) return;

    if (!pages[next]) {
      await fetchPage(next);
    } else {
      dispatch(setCurrentPage(next));
    }
  };

  const previousPage = () => {
    const prev = currentPage - 1;

    if (prev < 1) return;

    dispatch(setCurrentPage(prev));
  };

  const handleCategoryChange = async (
    category: string
  ) => {
    setSelectedCategory(category);

    if (!category) {
      dispatch(setFilteredProducts([]));
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/products/category/${category}`
    );

    dispatch(
      setFilteredProducts(res.data.products)
    );
  };

  const displayProducts =
    selectedCategory !== ""
      ? filteredProducts
      : pages[currentPage] || [];

  return (
    <div
      style={{
        width: "700px",
        margin: "20px auto",
      }}
    >
      <h1>Redux Pagination Cache</h1>

      <select
        value={selectedCategory}
        onChange={(e) =>
          handleCategoryChange(e.target.value)
        }
      >
        <option value="">
          Select Category
        </option>

        <option value="electronics">
          Electronics
        </option>

        <option value="fashion">
          Fashion
        </option>

        <option value="grocery">
          Grocery
        </option>
      </select>

      <ProductList products={displayProducts} />

      {!selectedCategory && (
        <>
          <button
            onClick={previousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span
            style={{
              margin: "0 20px",
            }}
          >
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default App;