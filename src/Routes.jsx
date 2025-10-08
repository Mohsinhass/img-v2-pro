import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ImageEditor from './pages/image-editor';
import ImageConversionHub from './pages/image-conversion-hub';
import PricePage from './pages/premium-features';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import Updates from './pages/Updates';
import UpdateDetail from './pages/updates/UpdateDetail';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import Gdpr from './pages/legal/Gdpr';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AuthCallback from './pages/auth/Callback';
import ProfilePage from './pages/account/Profile';
import SettingsPage from './pages/account/Settings';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ImageConversionHub />} />
        <Route path="/image-editor" element={<ImageEditor />} />
  {/** Conversion history route removed */}
        <Route path="/image-conversion-hub" element={<ImageConversionHub />} />
  <Route path="/premium-features" element={<PricePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/updates" element={<Updates />} />
  <Route path="/updates/:slug" element={<UpdateDetail />} />
  <Route path="/auth/sign-in" element={<SignIn />} />
  <Route path="/auth/sign-up" element={<SignUp />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
  <Route path="/auth/reset" element={<ResetPassword />} />
  <Route path="/account" element={<ProfilePage />} />
  <Route path="/settings" element={<SettingsPage />} />
    <Route path="/legal/privacy" element={<PrivacyPolicy />} />
    <Route path="/legal/terms" element={<TermsOfService />} />
    <Route path="/legal/cookies" element={<CookiePolicy />} />
    <Route path="/legal/gdpr" element={<Gdpr />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;