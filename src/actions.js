import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com/products';

export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    dispatch({ type: 'SET_CATEGORIES', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_CATEGORIES_ERROR', payload: error.message });
  }
};

export const fetchProducts = (category = '', search = '', page = 1) => async (dispatch) => {
  try {
    let url = `${API_BASE_URL}?limit=10&skip=${(page - 1) * 10}`;
    
    if (category) {
      url += `&category=${category}`;
    }
    if (search) {
      url += `&q=${search}`;
    }
    
    const response = await axios.get(url);
    dispatch({ type: 'SET_PRODUCTS', payload: response.data.products });
  } catch (error) {
    dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: error.message });
  }
};

export const resetProducts = () => (dispatch) => {
  dispatch({ type: 'RESET_PRODUCTS', payload: [] });
};
const categoryReducer = (state = initialState.categories, action) => {
    switch (action.type) {
      case 'SET_CATEGORIES':
        return { data: action.payload, error: null };
      case 'FETCH_CATEGORIES_ERROR':
        return { data: [], error: action.payload };
      default:
        return state;
    }
  };
  
  const productReducer = (state = initialState.products, action) => {
    switch (action.type) {
      case 'SET_PRODUCTS':
        return { data: [...state.data, ...action.payload], error: null }; // Accumulate products
      case 'RESET_PRODUCTS':
        return { data: [], error: null };
      case 'FETCH_PRODUCTS_ERROR':
        return { data: [], error: action.payload };
      default:
        return state;
    }
  };
  