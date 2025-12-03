import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCar, getMyCars, updateCar, deleteCar, getSellerRequests } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myCars, setMyCars] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [activeTab, setActiveTab] = useState('cars');
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    description: '',
    images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role === 'seller') {
      fetchMyCars();
      fetchRequests();
    }
  }, [user]);

  const fetchMyCars = async () => {
    try {
      const data = await getMyCars();
      setMyCars(data);
    } catch (error) {
      console.error('Error fetching my cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const data = await getSellerRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (editingCar) {
        await updateCar(editingCar._id, formData);
        setMessage('Car updated successfully!');
      } else {
        await createCar(formData);
        setMessage('Car added successfully!');
      }
      resetForm();
      fetchMyCars();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving car');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      brand: '',
      model: '',
      year: '',
      price: '',
      description: '',
      images: [],
    });
    setEditingCar(null);
    setShowForm(false);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      title: car.title,
      brand: car.brand,
      model: car.model,
      year: car.year.toString(),
      price: car.price.toString(),
      description: car.description,
      images: [],
    });
    setShowForm(true);
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(carId);
        fetchMyCars();
        setMessage('Car deleted successfully!');
      } catch (error) {
        setMessage('Error deleting car');
      }
    }
  };

  if (user && user.role !== 'seller') {
    return <div className="error">Access denied. Seller role required.</div>;
  }

  return (
    <div className="seller-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Seller Dashboard</h1>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="add-car-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'Cancel' : '+ Add New Car'}
        </motion.button>
      </motion.div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          My Cars ({myCars.length})
        </button>
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Buyer Requests ({requests.length})
        </button>
      </div>

      {showForm && (
        <motion.div
          className="car-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
          <form onSubmit={handleSubmit} className="car-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Images {!editingCar && '*'} (Multiple images allowed)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required={!editingCar}
              />
            </div>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-actions">
              <motion.button
                type="submit"
                disabled={submitting}
                className="submit-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? 'Saving...' : editingCar ? 'Update Car' : 'Add Car'}
              </motion.button>
              <motion.button
                type="button"
                onClick={resetForm}
                className="cancel-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'cars' && (
        <div className="my-cars-section">
          {loading ? (
            <div className="loading">Loading your cars...</div>
          ) : myCars.length === 0 ? (
            <div className="no-cars">You haven't listed any cars yet.</div>
          ) : (
            <motion.div
              className="my-cars-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {myCars.map((car, index) => (
                <motion.div
                  key={car._id}
                  className="my-car-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="my-car-image">
                    {car.images && car.images.length > 0 ? (
                      <img src={`http://localhost:5001${car.images[0]}`} alt={car.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="my-car-content">
                    <h3>{car.title}</h3>
                    <p>{car.brand} {car.model} ({car.year})</p>
                    <p className="price">${car.price.toLocaleString()}</p>
                    <div className="my-car-actions">
                      <motion.button
                        onClick={() => handleEdit(car)}
                        className="edit-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(car._id)}
                        className="delete-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                      <motion.button
                        onClick={() => navigate(`/cars/${car._id}`)}
                        className="view-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="requests-section">
          {requests.length === 0 ? (
            <div className="no-requests">No buyer requests yet.</div>
          ) : (
            <motion.div
              className="requests-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {requests.map((request, index) => (
                <motion.div
                  key={request._id}
                  className="request-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="request-header">
                    <div>
                      <h3>{request.carId.title}</h3>
                      <p>{request.carId.brand} {request.carId.model}</p>
                    </div>
                    <div className="request-price">
                      <span className="label">Listed Price:</span>
                      <span className="value">${request.carId.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="request-details">
                    <div className="request-buyer">
                      <span className="label">Buyer:</span>
                      <span className="value">{request.buyerId.name}</span>
                    </div>
                    <div className="request-offer">
                      <span className="label">Offer Amount:</span>
                      <span className="value offer-amount">${request.amount.toLocaleString()}</span>
                    </div>
                    <div className="request-status">
                      <span className={`status-badge ${request.status}`}>{request.status}</span>
                    </div>
                  </div>
                  {request.message && (
                    <div className="request-message">
                      <span className="label">Message:</span>
                      <p>{request.message}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

