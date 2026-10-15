import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from './components/SiteLayout';
import { CartProvider } from './hooks/useCart';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CctvPage from './pages/CctvPage';
import WholesalePage from './pages/WholesalePage';
import ContactPage from './pages/ContactPage';
import SuccessPage from './pages/SuccessPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
    return (
        <CartProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route element={<SiteLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/cctv" element={<CctvPage />} />
                        <Route path="/wholesale" element={<WholesalePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                    </Route>
                </Routes>
                <Toaster />
            </Router>
        </CartProvider>
    );
}

export default App;
