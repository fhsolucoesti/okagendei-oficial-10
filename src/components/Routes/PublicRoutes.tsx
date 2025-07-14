
import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import LandingPage from '@/pages/LandingPage';
import BookingPage from '@/pages/Public/BookingPage';
import CancelledSubscription from '@/pages/CancelledSubscription';
import NotFound from '@/pages/NotFound';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/assinatura-cancelada" element={<CancelledSubscription />} />
      <Route path="/agendar/:companyUrl" element={<BookingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
