import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, search, skip }) => {
    let url = `https://dummyjson.com/products?limit=10&skip=${skip}`;
    if (category) {
      url = `https://dummyjson.com/products/category/${category}?limit=10&skip=${skip}`;
    }
    if (search) {
      url = `${url}&q=${search}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data.products;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    skip: 0,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    resetProducts(state) {
      state.products = [];
      state.skip = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, ...action.payload];
        state.skip += 10;
        if (action.payload.length < 10) {
          state.hasMore = false;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
