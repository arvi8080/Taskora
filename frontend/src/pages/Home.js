import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

// SaaS Landing Page Components
import HeroSection from '../components/Landing/HeroSection';
import PopularServicesSection from '../components/Landing/PopularServicesSection';
import HowItWorksSection from '../components/Landing/HowItWorksSection';
import StatisticsSection from '../components/Landing/StatisticsSection';
import WhyChooseUsSection from '../components/Landing/WhyChooseUsSection';
import TestimonialsSection from '../components/Landing/TestimonialsSection';
import MobileAppSection from '../components/Landing/MobileAppSection';
import FAQSection from '../components/Landing/FAQSection';
import ContactModal from '../components/Landing/ContactModal';

// Floating Modals
import AIChatbot from '../components/Home/AIChatbot';
import VoiceSearch from '../components/Home/VoiceSearch';
import EmergencyButton from '../components/Home/EmergencyButton';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { emitEvent } = useSocket();

  const [showChatbot, setShowChatbot] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Emergency Handler
  const handleEmergency = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          emitEvent('emergency-alert', {
            location,
            emergencyType: 'general',
            description: 'Emergency service requested',
          });
          
          navigate('/emergency');
        },
        (error) => {
          console.error('Error getting location:', error);
          navigate('/emergency');
        }
      );
    } else {
      navigate('/emergency');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors">
      
      {/* Main SaaS Sections */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection 
          onAIChat={() => setShowChatbot(true)}
          onVoiceSearch={() => setShowVoiceSearch(true)}
          onEmergency={handleEmergency}
        />

        {/* 2. Popular Services Grid */}
        <PopularServicesSection />

        {/* 3. How It Works - 4 Horizontal Step Cards */}
        <HowItWorksSection />

        {/* 4. Key Metrics & Statistics */}
        <StatisticsSection />

        {/* 5. Why Choose Us Features */}
        <WhyChooseUsSection />

        {/* 6. Customer Testimonials */}
        <TestimonialsSection />

        {/* 7. Mobile App Mockup Section */}
        <MobileAppSection />

        {/* 8. Accordion FAQ Section */}
        <FAQSection />
      </main>

      {/* Floating Emergency SOS Button */}
      <EmergencyButton onClick={handleEmergency} />

      {/* Interactive Modals */}
      {showChatbot && (
        <AIChatbot 
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
        />
      )}

      {showVoiceSearch && (
        <VoiceSearch 
          isOpen={showVoiceSearch}
          onClose={() => setShowVoiceSearch(false)}
        />
      )}

      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

    </div>
  );
};

export default Home;
