import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
}

interface ProductState {
  pages: Record<number, Product[]>;
  currentPage: number;
  totalPages: number;
  filteredProducts: Product[];
}

const initialState: ProductState = {
  pages: {},
  currentPage: 1,
  totalPages: 1,
  filteredProducts: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    cachePage: (
      state,
      action: PayloadAction<{
        page: number;
        products: Product[];
        totalPages: number;
      }>
    ) => {
      state.pages[action.payload.page] =
        action.payload.products;

      state.currentPage = action.payload.page;

      state.totalPages = action.payload.totalPages;
    },

    setCurrentPage: (
      state,
      action: PayloadAction<number>
    ) => {
      state.currentPage = action.payload;
    },

    setFilteredProducts: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.filteredProducts = action.payload;
    },
  },
});

export const {
  cachePage,
  setCurrentPage,
  setFilteredProducts,
} = productSlice.actions;

export default productSlice.reducer;