import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
 
let products = [
  {
    id: 1,
    title: "Laptop",
    price: 55000,
    category: "Electronics"
  },
  {
    id: 2,
    title: "Mobile",
    price: 25000,
    category: "Electronics"
  },
  {
    id: 3,
    title: "Shoes",
    price: 3000,
    category: "Fashion"
  }
];

const typeDefs = `#graphql
  type Product {
    id: ID!
    title: String!
    price: Int!
    category: String!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
    productsByCategory(category: String!): [Product]
    totalProducts: Int
  }

  type Mutation {
    addProduct(
      title: String!
      price: Int!
      category: String!
    ): Product

    updateProductPrice(
      id: ID!
      price: Int!
    ): Product

    deleteProduct(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) =>
      products.find((p) => p.id === Number(id)),
    productsByCategory: (_, { category }) =>
      products.filter(
        (p) =>
          p.category.toLowerCase() ===
          category.toLowerCase()
      ),
    totalProducts: () => products.length
  },

  Mutation: {
    addProduct: (_, { title, price, category }) => {
      const product = {
        id: products.length + 1,
        title,
        price,
        category
      };

      products.push(product);

      return product;
    },

    updateProductPrice: (_, { id, price }) => {
      const product = products.find(
        (p) => p.id === Number(id)
      );

      if (!product) return null;

      product.price = price;

      return product;
    },

    deleteProduct: (_, { id }) => {
      const index = products.findIndex(
        (p) => p.id === Number(id)
      );

      if (index === -1) return "Not Found";

      products.splice(index, 1);

      return "Deleted Successfully";
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

await server.start();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/graphql",
  expressMiddleware(server)
);

app.listen(4000, () => {
  console.log(
    "http://localhost:4000/graphql"
  );
});