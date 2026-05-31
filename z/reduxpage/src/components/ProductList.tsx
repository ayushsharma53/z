import { Product } from "../features/productSlice";

interface Props {
  products: Product[];
}

const ProductList = ({ products }: Props) => {
  return (
    <div>
      {products.map((product) => (
        <div
          key={product._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{product.title}</h3>
          <p>₹{product.price}</p>
          <p>{product.category}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;