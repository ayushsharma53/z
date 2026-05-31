import { useState } from "react";
import {
  useQuery,
  useLazyQuery,
  useMutation
} from "@apollo/client";

import {
  GET_PRODUCTS,
  GET_PRODUCT,
  GET_BY_CATEGORY,
  TOTAL_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRICE,
  DELETE_PRODUCT
} from "graph/src/graphql";

function App() {
  const [productId, setProductId] = useState("");
  const [category, setCategory] = useState("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const {
    data,
    loading,
    error
  } = useQuery(GET_PRODUCTS);

  const { data: totalData } =
    useQuery(TOTAL_PRODUCTS);

  const [
    getProduct,
    {
      data: singleProduct,
      loading: singleLoading
    }
  ] = useLazyQuery(GET_PRODUCT);

  const [
    searchCategory,
    { data: categoryData }
  ] = useLazyQuery(GET_BY_CATEGORY);

  const [addProduct] = useMutation(
    ADD_PRODUCT,
    {
      refetchQueries: [
        GET_PRODUCTS,
        TOTAL_PRODUCTS
      ]
    }
  );

  const [updateProduct] = useMutation(
    UPDATE_PRICE,
    {
      refetchQueries: [GET_PRODUCTS]
    }
  );

  const [deleteProduct] = useMutation(
    DELETE_PRODUCT,
    {
      refetchQueries: [
        GET_PRODUCTS,
        TOTAL_PRODUCTS
      ]
    }
  );

  if (loading) return <h2>Loading...</h2>;

  if (error)
    return <h2>Something went wrong!</h2>;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <h1>GraphQL Product App</h1>

      <h2>
        Total Products:{" "}
        {totalData?.totalProducts}
      </h2>

      <hr />

      <h2>All Products</h2>

      {data?.products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px"
          }}
        >
          <h3>{product.title}</h3>
          <p>Price: ₹{product.price}</p>
          <p>{product.category}</p>

          <button
            onClick={() =>
              deleteProduct({
                variables: {
                  id: product.id
                }
              })
            }
          >
            Delete
          </button>
        </div>
      ))}

      <hr />

      <h2>Get Product By ID</h2>

      <input
        value={productId}
        onChange={(e) =>
          setProductId(e.target.value)
        }
        placeholder="Enter ID"
      />

      <button
        onClick={() =>
          getProduct({
            variables: {
              id: productId
            }
          })
        }
      >
        Get Product Details
      </button>

      {singleLoading && <p>Loading...</p>}

      {singleProduct?.product && (
        <div>
          <h3>
            {singleProduct.product.title}
          </h3>
          <p>
            ₹{singleProduct.product.price}
          </p>
        </div>
      )}

      <hr />

      <h2>Search By Category</h2>

      <input
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        placeholder="Electronics"
      />

      <button
        onClick={() =>
          searchCategory({
            variables: { category }
          })
        }
      >
        Search
      </button>

      {categoryData?.productsByCategory?.map(
        (p) => (
          <div key={p.id}>
            {p.title} - ₹{p.price}
          </div>
        )
      )}

      <hr />

      <h2>Add Product</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
      />

      <input
        placeholder="Category"
        value={cat}
        onChange={(e) =>
          setCat(e.target.value)
        }
      />

      <button
        onClick={() =>
          addProduct({
            variables: {
              title,
              price: Number(price),
              category: cat
            }
          })
        }
      >
        Add Product
      </button>

      <hr />

      <h2>Update Price</h2>

      <input
        placeholder="Product ID"
        value={updateId}
        onChange={(e) =>
          setUpdateId(e.target.value)
        }
      />

      <input
        placeholder="New Price"
        value={newPrice}
        onChange={(e) =>
          setNewPrice(e.target.value)
        }
      />

      <button
        onClick={() =>
          updateProduct({
            variables: {
              id: updateId,
              price: Number(newPrice)
            }
          })
        }
      >
        Update Price
      </button>
    </div>
  );
}

export default App;