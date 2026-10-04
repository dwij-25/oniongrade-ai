import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import GradingModal from "./components/GradingModal";
import FarmerDashboard from "./pages/FarmerDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import PublicLanding from "./pages/PublicLanding";
import LoginPage from "./pages/LoginPage";
import LotVerificationPage from "./pages/LotVerificationPage";
import { ROLES } from "./constants/rules";
import { CheckCircle, Info, AlertTriangle } from "lucide-react";

function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== requiredRole) return <Navigate to={`/${role}`} replace />;
  return children;
}

function MainLayout() {
  const { role, isLoggedIn, toast } = useAuth();

  return (
    <div className="min-h-screen bg-[#000000] text-[#F8D5C2] flex flex-col justify-between selection:bg-[#F18B49] selection:text-[#000000] pb-8">
      
      {/* Top Universal Header */}
      <div>
        <Header />

        {/* Global Floating Toast */}
        {toast && (
          <div className="fixed top-16 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
            <div className={`px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-2.5 text-xs font-mono font-bold ${
              toast.type === "error"
                ? "bg-[#5F1C47]/95 border-[#EB87A9]/50 text-[#F8D5C2] shadow-[#5F1C47]/50"
                : toast.type === "warning"
                ? "bg-[#EB87A9]/95 border-[#EB87A9] text-[#000000] shadow-[#EB87A9]/30"
                : toast.type === "info"
                ? "bg-[#180815]/95 border-[#5F1C47] text-[#F8D5C2] shadow-black/50"
                : "bg-[#F18B49]/95 border-[#FAAC78] text-[#000000] shadow-[#F18B49]/30"
            }`}>
              {toast.type === "error" ? (
                <AlertTriangle size={16} />
              ) : toast.type === "warning" ? (
                <AlertTriangle size={16} />
              ) : toast.type === "info" ? (
                <Info size={16} className="text-[#F18B49]" />
              ) : (
                <CheckCircle size={16} />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Main Routed Content */}
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<PublicLanding />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify/:lotId" element={<LotVerificationPage />} />
            <Route path="/farmer" element={<ProtectedRoute requiredRole={ROLES.FARMER}><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/retailer" element={<ProtectedRoute requiredRole={ROLES.RETAILER}><RetailerDashboard /></ProtectedRoute>} />
            <Route path="/officer" element={<ProtectedRoute requiredRole={ROLES.OFFICER}><OfficerDashboard /></ProtectedRoute>} />
            <Route path="/government" element={<ProtectedRoute requiredRole={ROLES.GOVERNMENT}><GovernmentDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Universal Login Modal */}
      <LoginModal />

      {/* Universal Optical AI Grading Terminal Modal */}
      <GradingModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
