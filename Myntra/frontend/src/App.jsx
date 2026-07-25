import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Passport from './pages/Passport';
import OutfitPlanner from './pages/OutfitPlanner';
import HeritageHub from './pages/HeritageHub';
import StatePage from './pages/StatePage';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderSummary from './pages/OrderSummary';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminEditProduct from './pages/AdminEditProduct';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <Routes>
          {/* User Facing Routes with standard navbar/footer */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />
          <Route
            path="/register"
            element={
              <MainLayout>
                <Register />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <Profile />
              </MainLayout>
            }
          />
          <Route
            path="/passport"
            element={
              <MainLayout>
                <Passport />
              </MainLayout>
            }
          />
          <Route
            path="/outfit-planner"
            element={
              <MainLayout>
                <OutfitPlanner />
              </MainLayout>
            }
          />
          <Route
            path="/heritage"
            element={
              <MainLayout>
                <HeritageHub />
              </MainLayout>
            }
          />
          <Route
            path="/heritage/:stateName"
            element={
              <MainLayout>
                <StatePage />
              </MainLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            }
          />
            <Route
            path="/search"
            element={
              <MainLayout>
                <SearchResults />
              </MainLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />
          <Route
            path="/wishlist"
            element={
              <MainLayout>
                <Wishlist />
              </MainLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <MainLayout>
                <Checkout />
              </MainLayout>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <MainLayout>
                <OrderConfirmation />
              </MainLayout>
            }
          />
          <Route
            path="/order-summary/:id"
            element={
              <MainLayout>
                <OrderSummary />
              </MainLayout>
            }
          />

          {/* Dedicated Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
        </Routes>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
