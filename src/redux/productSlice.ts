import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Review {
  customer: string;
  review: string;
  score: number;
}

export interface SalesData {
  weekEnding: string;
  retailSales: number;
  wholesaleSales: number;
  unitsSold: number;
  retailerMargin: number;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  subtitle: string;
  brand: string;
  reviews: Review[];
  retailer: string;
  details: string[];
  tags: string[];
  sales: SalesData[];
}

export type ProductState = {
  products: Product[];
  selectedIndex: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  sortingDirection: 'asc' | 'desc';
  sortingColumn: string;
};

export interface RootState {
  product: ProductState;
}

// Selector to get the current product based on selectedIndex
export const currentProduct = (state: RootState): Product | {} => {
  const products = state.product.products;
  const selectedIndex = state.product.selectedIndex;
  return products.length ? products[selectedIndex] : {};
};

// Fetch products from the JSON file
export const fetchProducts = createAsyncThunk<Product[]>(
  'product/fetchProducts',
  async () => {
    const response = await fetch(
      'data/stackline_frontend_assessment_data_2021.json'
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
);

const initialState: ProductState = {
  products: [],
  selectedIndex: 0,
  status: 'idle',
  sortingDirection: 'asc',
  sortingColumn: 'weekEnding',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    sortByColumn: (state, action) => {
      const {
        field,
        direction,
      }: { field: keyof SalesData; direction: 'asc' | 'desc' } = action.payload;
      const selectedProduct = state.products[state.selectedIndex];

      if (!selectedProduct || !selectedProduct.sales) {
        return state;
      }

      state.sortingDirection = direction;
      state.sortingColumn = field;

      selectedProduct.sales.sort((a: SalesData, b: SalesData) => {
        if (field === 'weekEnding') {
          // Ensure the weekEnding property is treated as a date
          return direction === 'asc'
            ? new Date(a.weekEnding).getTime() -
                new Date(b.weekEnding).getTime()
            : new Date(b.weekEnding).getTime() -
                new Date(a.weekEnding).getTime();
        } else {
          return direction === 'asc'
            ? a[field] - b[field]
            : b[field] - a[field];
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Fetch failed:', action.payload);
      });
  },
});

export const { sortByColumn } = productSlice.actions;
export default productSlice.reducer;
