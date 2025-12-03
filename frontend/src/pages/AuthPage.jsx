import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        if (!formData.email) {
          setError('Email is required');
          setLoading(false);
          return;
        }
        if (!formData.password || formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        console.log('Calling signup with:', { 
          name: formData.name, 
          email: formData.email, 
          role: formData.role 
        });
        const result = await signup(formData.name, formData.email, formData.password, formData.role);
        console.log('Signup successful:', result);
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="auth-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Login to continue' : 'Join CarHub today'}</p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="auth-form"
        >
          {!isLogin && (
            <motion.div variants={itemVariants} className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your name"
              />
            </motion.div>
          )}

          {!isLogin && (
            <motion.div variants={itemVariants} className="form-group">
              <label>I want to</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'buyer' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                >
                  Buy Cars
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'seller' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                >
                  Sell Cars
                </button>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </motion.div>

          {error && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            className="submit-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '', role: 'buyer' });
              }}
              className="switch-button"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

