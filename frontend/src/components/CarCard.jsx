import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CarCard.css';

const CarCard = ({ car, index }) => {
  const imageUrl = car.images && car.images.length > 0 
    ? `http://localhost:5001${car.images[0]}` 
    : '/placeholder-car.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/cars/${car._id}`} className="car-card">
        <div className="car-card-image">
          <img src={imageUrl} alt={car.title} />
          <div className="car-card-overlay">
            <span className="car-status">Available</span>
          </div>
        </div>
        <div className="car-card-content">
          <h3 className="car-card-title">{car.title}</h3>
          <p className="car-card-brand">{car.brand} {car.model}</p>
          <div className="car-card-details">
            <span className="car-card-year">{car.year}</span>
            <span className="car-card-price">${car.price.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;

