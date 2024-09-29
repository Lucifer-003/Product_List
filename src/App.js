import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from './redux/categoriesSlice';
import { fetchProducts, resetProducts } from './redux/productsSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css'; // Import CSS styles

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useSelector((state) => state.categories.categories);
  const products = useSelector((state) => state.products.products);
  const hasMore = useSelector((state) => state.products.hasMore);
  const loadingCategories = useSelector((state) => state.categories.loading);
  const loadingProducts = useSelector((state) => state.products.loading);
  const categoriesError = useSelector((state) => state.categories.error);
  const productsError = useSelector((state) => state.products.error);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const category = query.get('category') || '';
    const search = query.get('search') || '';
    setSelectedCategory(category);
    setSearchTerm(search);
    dispatch(resetProducts());
    dispatch(fetchProducts({ category, search, skip: 0 }));
  }, [location.search, dispatch]);

  const handleCategoryChange = (category) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('category', category);
    navigate({ search: searchParams.toString() });
  };

  const handleSearchChange = (e) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', e.target.value);
    navigate({ search: searchParams.toString() });
  };

  const loadMore = () => {
    if (hasMore && !loadingProducts) {
      setSkip((prevSkip) => prevSkip + 10);
      dispatch(fetchProducts({ category: selectedCategory, search: searchTerm, skip }));
    }
  };

  return (
    <div className="container">
      <h1>Product Listing</h1>
      <div className="select-container">
        <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory}>
          <option value="">All Categories</option>
          {loadingCategories && <option disabled>Loading categories...</option>}
          {categoriesError && <option disabled>Error loading categories</option>}
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search Products"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="product-list">
        {loadingProducts && <p className="loading-text">Loading products...</p>}
        {productsError && <p className="error-text">Error loading products: {productsError}</p>}
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
          </div>
        ))}
      </div>

      {hasMore && !loadingProducts && (
        <button className="load-more" onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default App;
