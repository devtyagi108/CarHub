import { useState } from 'react';
import { motion } from 'framer-motion';
import './SearchFilters.css';

const SearchFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      brand: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      page: 1,
      limit: 12,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <motion.div
      className="search-filters"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="filters-row">
        <input
          type="text"
          placeholder="Search cars..."
          value={localFilters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-input"
        />
        <select
          value={localFilters.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="filter-select"
        >
          <option value="">All Brands</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          <option value="BMW">BMW</option>
          <option value="Mercedes">Mercedes</option>
          <option value="Tesla">Tesla</option>
          <option value="Audi">Audi</option>
          <option value="Volkswagen">Volkswagen</option>
        </select>
        <input
          type="number"
          placeholder="Min Year"
          value={localFilters.minYear}
          onChange={(e) => handleChange('minYear', e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max Year"
          value={localFilters.maxYear}
          onChange={(e) => handleChange('maxYear', e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={localFilters.minPrice}
          onChange={(e) => handleChange('minPrice', e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={localFilters.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          className="filter-input"
        />
        <select
          value={localFilters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="filter-select"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="year-desc">Year: Newest First</option>
          <option value="year-asc">Year: Oldest First</option>
        </select>
        <motion.button
          onClick={handleReset}
          className="filter-reset"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchFilters;

