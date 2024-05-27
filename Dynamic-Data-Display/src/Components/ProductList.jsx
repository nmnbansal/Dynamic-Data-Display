// ProductList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './ProductList.css';

function ProductList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortCriteria, setSortCriteria] = useState('');
  const [viewMode, setViewMode] = useState('card');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const list = await res.json();
        setData(list);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const sortData = (items) => {
    if (sortCriteria === 'price-asc') {
      return items.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === 'price-desc') {
      return items.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === 'name-asc') {
      return items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortCriteria === 'name-desc') {
      return items.sort((a, b) => b.title.localeCompare(a.title));
    }
    return items;
  };

  const filteredData = data.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    return titleMatch && categoryMatch;
  });

  const sortedData = sortData(filteredData);

  const categories = [...new Set(data.map(item => item.category))];

  return (
    <div className="product-list-container">
      <div className="filters-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a product..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <select className="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="All">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select className="sort-select" value={sortCriteria} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
        <div className="view-toggle">
          <button
            className={`view-button ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('card')}
          >
            Card View
          </button>
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('list')}
          >
            List View
          </button>
        </div>
      </div>
      <div className={`product-list ${viewMode}`}>
        {loading ? "Loading ..." :
          sortedData.map((item, index) => (
            <div key={index} className={`product-item ${viewMode}`}>
              <h2>
                <Link to={`/product/${item.id}`} className="product-title">{item.title}</Link>
              </h2>
              <p className="product-category">Category: {item.category}</p>
              <p className="product-price">Price: ${item.price}</p>
              <p className="product-description">Description: {item.description}</p>
              <img className="product-image" src={item.image} alt={item.title} />
            </div>
          ))}
      </div>
    </div>
  );
}

export { ProductList };
