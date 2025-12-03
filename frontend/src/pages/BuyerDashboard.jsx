import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getMyOffers } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'buyer') {
      fetchMyOffers();
    }
  }, [user]);

  const fetchMyOffers = async () => {
    try {
      const data = await getMyOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching my offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user && user.role !== 'buyer') {
    return <div className="error">Access denied. Buyer role required.</div>;
  }

  return (
    <div className="buyer-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>My Offers</h1>
        <p>Track all your car purchase offers</p>
      </motion.div>

      {loading ? (
        <div className="loading">Loading your offers...</div>
      ) : offers.length === 0 ? (
        <motion.div
          className="no-offers"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>No offers yet</h2>
          <p>Start browsing cars and make your first offer!</p>
          <Link to="/" className="browse-button">
            Browse Cars
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="offers-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {offers.map((offer, index) => (
            <motion.div
              key={offer._id}
              className="offer-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <Link to={`/cars/${offer.carId._id}`} className="offer-car-link">
                <div className="offer-car-image">
                  {offer.carId.images && offer.carId.images.length > 0 ? (
                    <img src={`https://carhub-1fwz.onrender.com${offer.carId.images[0]}`} alt={offer.carId.title} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="offer-car-info">
                  <h3>{offer.carId.title}</h3>
                  <p>{offer.carId.brand} {offer.carId.model} ({offer.carId.year})</p>
                  <div className="offer-price-comparison">
                    <div className="price-item">
                      <span className="label">Listed Price:</span>
                      <span className="value listed">${offer.carId.price.toLocaleString()}</span>
                    </div>
                    <div className="price-item">
                      <span className="label">Your Offer:</span>
                      <span className="value offer">${offer.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="offer-details">
                <div className="offer-status">
                  <span className={`status-badge ${offer.status}`}>{offer.status}</span>
                </div>
                {offer.message && (
                  <div className="offer-message">
                    <span className="label">Your Message:</span>
                    <p>{offer.message}</p>
                  </div>
                )}
                <div className="offer-date">
                  Submitted: {new Date(offer.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BuyerDashboard;

