import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Home } from './pages/Home';
import { Treks } from './pages/Treks';
import { TrekDetail } from './pages/TrekDetail';
import { Homestays } from './pages/Homestays';
import { HomestayDetail } from './pages/HomestayDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="treks" element={<Treks />} />
        <Route path="treks/:slug" element={<TrekDetail />} />
        <Route path="homestays" element={<Homestays />} />
        <Route path="homestays/:slug" element={<HomestayDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
