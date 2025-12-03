import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars } from '../services/api';
import { motion } from 'framer-motion';
import CarCard from '../components/CarCard';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import './HomePage.css';

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    page: 1,
    limit: 12,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minYear) params.minYear = filters.minYear;
      if (filters.maxYear) params.maxYear = filters.maxYear;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;
      params.page = filters.page;
      params.limit = filters.limit;

      const data = await getCars(params);
      setCars(data.cars);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="home-page">
      <motion.div
        className="home-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Find Your Dream Car</h1>
        <p>Browse through our collection of premium vehicles</p>
      </motion.div>

      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loading">Loading cars...</div>
      ) : cars.length === 0 ? (
        <motion.div
          className="no-cars"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No cars found. Try adjusting your filters.
        </motion.div>
      ) : (
        <>
          <motion.div
            className="cars-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cars.map((car, index) => (
              <CarCard key={car._id} car={car} index={index} />
            ))}
          </motion.div>
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;

