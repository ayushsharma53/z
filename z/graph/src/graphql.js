import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      title
      price
      category
    }
  }
`;

export const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      title
      price
      category
    }
  }
`;

export const GET_BY_CATEGORY = gql`
  query Category($category: String!) {
    productsByCategory(category: $category) {
      id
      title
      price
      category
    }
  }
`;

export const TOTAL_PRODUCTS = gql`
  query {
    totalProducts
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $title: String!
    $price: Int!
    $category: String!
  ) {
    addProduct(
      title: $title
      price: $price
      category: $category
    ) {
      id
      title
    }
  }
`;

export const UPDATE_PRICE = gql`
  mutation UpdatePrice(
    $id: ID!
    $price: Int!
  ) {
    updateProductPrice(
      id: $id
      price: $price
    ) {
      id
      price
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;