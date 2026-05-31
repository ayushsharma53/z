interface ProductCardProps {
  title: string;
  price: number;
  thumbnail: string;
}

function ProductCard({
  title,
  price,
  thumbnail,
}: ProductCardProps) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px",
        width: "250px",
      }}
    >
      <img
        src={thumbnail}
        alt={title}
        width="200"
      />

      <h3>{title}</h3>

      <p>${price}</p>
    </div>
  );
}

export default ProductCard;