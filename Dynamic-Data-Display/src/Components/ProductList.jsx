import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './ProductList.css';

function ProductList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setSortOrder(e.target.value);
  };

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredData = data.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    return titleMatch && categoryMatch;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    } else if (sortOrder === 'price-desc') {
      return b.price - a.price;
    } else if (sortOrder === 'name-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'name-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          {[...new Set(data.map(item => item.category))].map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select className="sort-select" value={sortOrder} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
        <div className="view-toggle">
          <button className={`view-button ${viewMode === 'card' ? 'active' : ''}`} onClick={() => handleViewToggle('card')}>Card View</button>
          <button className={`view-button ${viewMode === 'list' ? 'active' : ''}`} onClick={() => handleViewToggle('list')}>List View</button>
        </div>
      </div>
      <div className={`product-list ${viewMode}`}>
        {loading ? "Loading ..." :
          paginatedData.map((item, index) => {
            const truncatedDescription = item.description.split(" ").slice(0, 20).join(" ") + '...';
            return (
              <div key={index} className={`product-item ${viewMode}`}>
                <div className="product-image-container">
                  <img className="product-image" src={item.image} alt={item.title} />
                </div>
                <div>
                  <h2>
                    <Link to={`/product/${item.id}`} className="product-title">{item.title}</Link>
                  </h2>
                  <p className="product-category">Category: {item.category}</p>
                  <p className="product-price">Price: ${item.price}</p>
                  <p className="product-description">{truncatedDescription}</p>
                </div>
              </div>
            );
          })}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export { ProductList };
