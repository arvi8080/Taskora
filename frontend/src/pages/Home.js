import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

// Components
import Hero from '../components/Home/Hero';
import AIChatbot from '../components/Home/AIChatbot';
import ServiceCategories from '../components/Home/ServiceCategories';
import HowItWorks from '../components/Home/HowItWorks';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import EmergencyButton from '../components/Home/EmergencyButton';
import VoiceSearch from '../components/Home/VoiceSearch';
import RealTimeTracking from '../components/Home/RealTimeTracking';
import Gamification from '../components/Home/Gamification';
import CommunitySection from '../components/Home/CommunitySection';
import Pricing from '../components/Home/Pricing';
import Stats from '../components/Home/Stats';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { emitEvent } = useSocket();
  const [showChatbot, setShowChatbot] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  // Emergency handler
  const handleEmergency = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Emit emergency alert
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

  // Voice search handler
  const handleVoiceSearch = () => {
    setShowVoiceSearch(true);
  };

  // AI chatbot handler
  const handleAIChat = () => {
    setShowChatbot(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        onEmergency={handleEmergency}
        onVoiceSearch={handleVoiceSearch}
        onAIChat={handleAIChat}
      />

      {/* AI Chatbot Modal */}
      {showChatbot && (
        <AIChatbot 
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
        />
      )}

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <VoiceSearch 
          isOpen={showVoiceSearch}
          onClose={() => setShowVoiceSearch(false)}
        />
      )}

      {/* Service Categories */}
      <ServiceCategories />

      {/* How It Works */}
      <HowItWorks />

      {/* Unique Features */}
      <Features />

      {/* Real-time Tracking Demo */}
      <RealTimeTracking />

      {/* Gamification */}
      <Gamification />

      {/* Community Section */}
      <CommunitySection />

      {/* Stats */}
      <Stats />

      {/* Pricing */}
      <Pricing />

      {/* Testimonials */}
      <Testimonials />

      {/* Emergency Button - Floating */}
      <EmergencyButton onClick={handleEmergency} />
    </div>
  );
};

export default Home;



