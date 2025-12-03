import axios from 'axios';

const API_URL = 'https://carhub-1fwz.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (name, email, password, role) => {
  try {
    console.log('Sending signup request:', { name, email, role });
    const response = await api.post('/auth/signup', { name, email, password, role });
    console.log('Signup response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Signup API error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Cars API
export const getCars = async (params = {}) => {
  const response = await api.get('/cars', { params });
  return response.data;
};

export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

export const createCar = async (carData) => {
  const formData = new FormData();
  formData.append('title', carData.title);
  formData.append('brand', carData.brand);
  formData.append('model', carData.model);
  formData.append('year', carData.year);
  formData.append('price', carData.price);
  formData.append('description', carData.description);
  
  carData.images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post('/cars', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCar = async (id, carData) => {
  const formData = new FormData();
  formData.append('title', carData.title);
  formData.append('brand', carData.brand);
  formData.append('model', carData.model);
  formData.append('year', carData.year);
  formData.append('price', carData.price);
  formData.append('description', carData.description);
  
  if (carData.images && carData.images.length > 0) {
    carData.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await api.put(`/cars/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCar = async (id) => {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
};

export const getMyCars = async () => {
  const response = await api.get('/cars/my-cars');
  return response.data;
};

// Offers API
export const createOffer = async (offerData) => {
  const response = await api.post('/offers', offerData);
  return response.data;
};

export const getCarOffers = async (carId) => {
  const response = await api.get(`/offers/car/${carId}`);
  return response.data;
};

export const getMyOffers = async () => {
  const response = await api.get('/offers/my-offers');
  return response.data;
};

export const getSellerRequests = async () => {
  const response = await api.get('/offers/seller-requests');
  return response.data;
};

export const updateOfferStatus = async (id, status) => {
  const response = await api.put(`/offers/${id}/status`, { status });
  return response.data;
};

export default api;

