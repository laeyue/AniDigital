import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/app/Login";
import Signup from "./pages/app/Signup";
import AppLayout from "./components/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import ClimateAdvisory from "./pages/app/ClimateAdvisory";
import CropDoctor from "./pages/app/CropDoctor";
import Marketplace from "./pages/app/Marketplace";
import MarketPrices from "./pages/app/MarketPrices";
import Finances from "./pages/app/Finances";
import Profile from "./pages/app/Profile";
import ProtectedRoute from "./components/app/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/app/login" element={<Login />} />
            <Route path="/app/signup" element={<Signup />} />
            
            {/* Protected App Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="climate-advisory" element={<ClimateAdvisory />} />
              <Route path="crop-doctor" element={<CropDoctor />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="market-prices" element={<MarketPrices />} />
              <Route path="finances" element={<Finances />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
