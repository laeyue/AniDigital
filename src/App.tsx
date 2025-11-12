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
              <Route path="climate-advisory" element={<div className="p-6">Climate Advisory - Coming Soon</div>} />
              <Route path="crop-doctor" element={<div className="p-6">Crop Doctor - Coming Soon</div>} />
              <Route path="marketplace" element={<div className="p-6">Marketplace - Coming Soon</div>} />
              <Route path="market-prices" element={<div className="p-6">Market Prices - Coming Soon</div>} />
              <Route path="finances" element={<div className="p-6">Farm Finances - Coming Soon</div>} />
              <Route path="profile" element={<div className="p-6">Profile - Coming Soon</div>} />
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
