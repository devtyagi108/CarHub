import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById, createOffer } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './CarDetailsPage.css';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const data = await getCarById(id);
      setCar(data);
    } catch (error) {
      console.error('Error fetching car:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role !== 'buyer') {
      setMessage('Only buyers can make offers.');
      return;
    }

    if (car.sellerId._id === user._id) {
      setMessage('You cannot make an offer on your own car.');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      await createOffer({
        carId: id,
        amount: parseFloat(offerAmount),
        message: offerMessage,
      });
      setMessage('Offer submitted successfully!');
      setOfferAmount('');
      setOfferMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting offer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading car details...</div>;
  }

  if (!car) {
    return <div className="error">Car not found</div>;
  }

  const images = car.images && car.images.length > 0 
    ? car.images.map(img => `https://carhub-1fwz.onrender.com${img}`)
    : ['/placeholder-car.jpg'];

  return (
    <div className="car-details-page">
      <motion.div
        className="car-details-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="car-images">
          <motion.div
            className="main-image"
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={images[selectedImage]} alt={car.title} />
          </motion.div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <motion.img
                  key={index}
                  src={img}
                  alt={`${car.title} ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="car-info">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {car.title}
          </motion.h1>
          <div className="car-specs">
            <div className="spec-item">
              <span className="spec-label">Brand</span>
              <span className="spec-value">{car.brand}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Model</span>
              <span className="spec-value">{car.model}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Year</span>
              <span className="spec-value">{car.year}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Price</span>
              <span className="spec-value price">${car.price.toLocaleString()}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Seller</span>
              <span className="spec-value">{car.sellerId?.name || 'Unknown'}</span>
            </div>
          </div>

          <div className="car-description">
            <h2>Description</h2>
            <p>{car.description || 'No description provided.'}</p>
          </div>

          {user && user.role === 'buyer' && car.sellerId._id !== user._id && (
            <motion.div
              className="offer-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2>Make an Offer</h2>
              <form onSubmit={handleSubmitOffer} className="offer-form">
                <div className="form-group">
                  <label>Offer Amount ($)</label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    required
                    min="1"
                    step="0.01"
                    placeholder="Enter your offer"
                  />
                </div>
                <div className="form-group">
                  <label>Message (Optional)</label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    rows="4"
                    placeholder="Add a message to the seller..."
                  />
                </div>
                {message && (
                  <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="submit-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Offer'}
                </motion.button>
              </form>
            </motion.div>
          )}

          {!user && (
            <div className="login-prompt">
              <p>Please <a href="/auth">login</a> as a buyer to make an offer.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CarDetailsPage;

