import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/FackAuthContext.js";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Appointment from "./pages/Appointment";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import CalendarPage from "./pages/Calendar";
import NavMenu from "./components/NavMenu";
import GraphicalStatistics from "./pages/GraphicalStatistics";
import AppointmentSubmit from "./pages/AppointmentSubmit";
import NearbyDoctors from "./pages/NearbyDoctors";
import ProtectedRoute from "./ProtectedRoute.js";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Protected routes with NavMenu */}
            <Route element={<NavMenu />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/map" element={<NearbyDoctors />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/statistics" element={<GraphicalStatistics />} />
              <Route
                path="/appointment"
                element={
                  <ProtectedRoute>
                    <Appointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment/submit"
                element={<AppointmentSubmit />}
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
