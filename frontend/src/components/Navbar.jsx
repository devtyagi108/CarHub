import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CarHub
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Browse Cars
          </Link>
          {user ? (
            <>
              {user.role === 'seller' && (
                <Link to="/seller" className="navbar-link">
                  Seller Dashboard
                </Link>
              )}
              {user.role === 'buyer' && (
                <Link to="/buyer" className="navbar-link">
                  My Offers
                </Link>
              )}
              <span className="navbar-user">{user.name}</span>
              <motion.button
                onClick={handleLogout}
                className="navbar-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <Link to="/auth" className="navbar-link">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

