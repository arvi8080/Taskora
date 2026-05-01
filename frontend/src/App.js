import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ExpertDashboard from './pages/Dashboard/ExpertDashboard';
import BookService from './pages/BookService/BookService';
import ExpertProfile from './pages/Expert/ExpertProfile';
import ExpertList from './pages/Expert/ExpertList';
import ElectricalExperts from './pages/Expert/ElectricalExperts';
import PlumbingExperts from './pages/Expert/PlumbingExperts';
import CarpenterExperts from './pages/Expert/CarpenterExperts';
import PainterExperts from './pages/Expert/PainterExperts';
import CleanerExperts from './pages/Expert/CleanerExperts';
import MechanicExperts from './pages/Expert/MechanicExperts';
import TechnicianExperts from './pages/Expert/TechnicianExperts';
import CookExperts from './pages/Expert/CookExperts';
import BecomeExpert from './pages/Expert/BecomeExpert';
import BookingDetails from './pages/Booking/BookingDetails';
import MyBookings from './pages/Booking/MyBookings';
import Chat from './pages/Chat/Chat';
import VideoCall from './pages/Video/VideoCall';
import Emergency from './pages/Emergency/Emergency';
import Community from './pages/Community/Community';
import Subscription from './pages/Subscription/Subscription';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                
                <main className="min-h-screen">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/experts" element={<ExpertList />} />
                    <Route path="/electrical-experts" element={<ElectricalExperts />} />
                    <Route path="/plumbing-experts" element={<PlumbingExperts />} />
                    <Route path="/carpentry-experts" element={<CarpenterExperts />} />
                    <Route path="/painting-experts" element={<PainterExperts />} />
                    <Route path="/cleaning-experts" element={<CleanerExperts />} />
                    <Route path="/mechanic-experts" element={<MechanicExperts />} />
                    <Route path="/technician-experts" element={<TechnicianExperts />} />
                    <Route path="/cooking-experts" element={<CookExperts />} />
                    <Route path="/expert/:id" element={<ExpertProfile />} />
                    <Route path="/community" element={<Community />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/expert-dashboard" element={
                      <ProtectedRoute>
                        <ExpertDashboard />
                      </ProtectedRoute>
                    } />

                    <Route path="/become-expert" element={
                      <ProtectedRoute>
                        <BecomeExpert />
                      </ProtectedRoute>
                    } />

                    <Route path="/book-service" element={
                      <ProtectedRoute>
                        <BookService />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/bookings" element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/booking/:id" element={
                      <ProtectedRoute>
                        <BookingDetails />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/chat/:bookingId" element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/video-call/:bookingId" element={
                      <ProtectedRoute>
                        <VideoCall />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/emergency" element={
                      <ProtectedRoute>
                        <Emergency />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/subscription" element={
                      <ProtectedRoute>
                        <Subscription />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                
                <Footer />
                
                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;



