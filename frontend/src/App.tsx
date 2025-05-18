
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CallRequests from "./pages/CallRequests";
import Courses from "./pages/Courses";
import PaymentRequests from "./pages/PaymentRequests";
import Coupons from "./pages/Coupons";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./pages/Notifications";
import JoinUs from "./pages/JoinUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calls" element={<CallRequests />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/payments" element={<PaymentRequests />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/notification" element={<Notifications />} />
            <Route path="/joining" element={<JoinUs />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
