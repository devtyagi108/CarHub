import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CarDetailsPage from './pages/CarDetailsPage.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route
            path="/seller"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer"
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

