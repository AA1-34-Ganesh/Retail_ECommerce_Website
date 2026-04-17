import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingChatButton from './components/FloatingChatButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import ImageSearchPage from './pages/ImageSearchPage';
import { GamificationProvider } from './context/GamificationContext';

export default function App() {
  return (
    <GamificationProvider>
      <div className="min-h-screen bg-surface-950">
        <Navbar />
        <FloatingChatButton />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/image-search" element={<ImageSearchPage />} />
        </Routes>
      </div>
    </GamificationProvider>
  );
}
