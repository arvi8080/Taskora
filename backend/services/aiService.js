const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

class AIService {
  // AI-powered service matching
  static async matchExpert(userProblem, userLocation, urgency = 'medium') {
    try {
      // Analyze user problem with AI
      const analysis = await this.analyzeProblem(userProblem);
      
      // Find matching experts
      const experts = await Expert.find({
        'services.category': analysis.category,
        'location.serviceAreas': {
          $elemMatch: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [userLocation.lng, userLocation.lat]
              },
              $maxDistance: 10000 // 10km radius
            }
          }
        },
        isAvailable: true,
        isVerified: true
      }).populate('user', 'name phone rating');

      // AI-powered expert scoring
      const scoredExperts = await this.scoreExperts(experts, analysis, userLocation, urgency);
      
      return {
        success: true,
        matches: scoredExperts.slice(0, 5), // Top 5 matches
        analysis,
        confidence: scoredExperts[0]?.confidence || 0
      };
    } catch (error) {
      console.error('AI matching error:', error);
      return { success: false, error: error.message };
    }
  }

  // Analyze user problem using AI
  static async analyzeProblem(problemDescription) {
    try {
      // If OpenAI is not available, use simple keyword matching
      if (!openai) {
        return this.simpleProblemAnalysis(problemDescription);
      }

      const prompt = `
        Analyze this service request and extract:
        1. Service category (plumber, electrician, carpenter, painter, cleaner, mechanic, technician, cook, gardener, other)
        2. Subcategory
        3. Urgency level (low, medium, high, emergency)
        4. Required skills
        5. Estimated duration
        6. Materials needed
        
        Problem: "${problemDescription}"
        
        Respond in JSON format:
        {
          "category": "plumber",
          "subcategory": "pipe repair",
          "urgency": "high",
          "skills": ["pipe repair", "leak detection"],
          "duration": 2,
          "materials": ["pipe", "fittings", "sealant"],
          "confidence": 0.85
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.simpleProblemAnalysis(problemDescription);
    }
  }

  // Simple keyword-based problem analysis (fallback)
  static simpleProblemAnalysis(problemDescription) {
    const text = problemDescription.toLowerCase();
    
    let category = 'other';
    let urgency = 'medium';
    
    // Category detection
    if (text.includes('plumb') || text.includes('pipe') || text.includes('water') || text.includes('leak')) {
      category = 'plumber';
    } else if (text.includes('electric') || text.includes('wire') || text.includes('power') || text.includes('switch')) {
      category = 'electrician';
    } else if (text.includes('carpent') || text.includes('wood') || text.includes('furniture')) {
      category = 'carpenter';
    } else if (text.includes('paint') || text.includes('color')) {
      category = 'painter';
    } else if (text.includes('clean') || text.includes('housekeeping')) {
      category = 'cleaner';
    } else if (text.includes('mechanic') || text.includes('car') || text.includes('vehicle')) {
      category = 'mechanic';
    } else if (text.includes('technician') || text.includes('repair') || text.includes('fix')) {
      category = 'technician';
    } else if (text.includes('cook') || text.includes('chef') || text.includes('food')) {
      category = 'cook';
    } else if (text.includes('garden') || text.includes('plant') || text.includes('lawn')) {
      category = 'gardener';
    }
    
    // Urgency detection
    if (text.includes('emergency') || text.includes('urgent') || text.includes('immediately') || text.includes('asap')) {
      urgency = 'emergency';
    } else if (text.includes('quick') || text.includes('fast') || text.includes('soon')) {
      urgency = 'high';
    } else if (text.includes('whenever') || text.includes('flexible') || text.includes('no rush')) {
      urgency = 'low';
    }
    
    return {
      category,
      subcategory: 'general',
      urgency,
      skills: [],
      duration: 2,
      materials: [],
      confidence: 0.7
    };
  }

  // Score experts based on multiple factors
  static async scoreExperts(experts, analysis, userLocation, urgency) {
    const scoredExperts = experts.map(expert => {
      let score = 0;
      let factors = [];

      // Rating factor (40% weight)
      const ratingScore = (expert.rating.average / 5) * 40;
      score += ratingScore;
      factors.push(`Rating: ${expert.rating.average}/5`);

      // Distance factor (25% weight)
      const distance = this.calculateDistance(
        userLocation,
        expert.location.current
      );
      const distanceScore = Math.max(0, 25 - (distance / 2)); // Closer is better
      score += distanceScore;
      factors.push(`Distance: ${distance.toFixed(1)}km`);

      // Experience factor (20% weight)
      const experienceScore = Math.min(20, expert.services[0]?.experience * 2);
      score += experienceScore;
      factors.push(`Experience: ${expert.services[0]?.experience} years`);

      // Availability factor (10% weight)
      const availabilityScore = expert.isOnline ? 10 : 5;
      score += availabilityScore;
      factors.push(`Online: ${expert.isOnline ? 'Yes' : 'No'}`);

      // Response time factor (5% weight)
      const responseScore = expert.responseTime.average > 0 
        ? Math.max(0, 5 - (expert.responseTime.average / 10))
        : 2.5;
      score += responseScore;
      factors.push(`Avg Response: ${expert.responseTime.average}min`);

      // Emergency factor (bonus for emergency requests)
      if (urgency === 'emergency' && expert.availability.emergencyAvailable) {
        score += 15;
        factors.push('Emergency Available');
      }

      // Gamification bonus
      if (expert.gamification.level >= 5) {
        score += 5;
        factors.push('High Level Expert');
      }

      return {
        expert,
        score: Math.round(score),
        confidence: Math.min(100, score),
        factors
      };
    });

    return scoredExperts.sort((a, b) => b.score - a.score);
  }

  // Calculate distance between two points
  static calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Chatbot response generation
  static async generateChatbotResponse(userMessage, context = {}) {
    try {
      // If OpenAI is not available, use simple response logic
      if (!openai) {
        return this.simpleChatbotResponse(userMessage, context);
      }

      const systemPrompt = `
        You are an AI assistant for an expert service platform. Help users with:
        1. Service requests and booking
        2. Finding the right expert
        3. Pricing information
        4. Emergency services
        5. General support
        
        Be helpful, friendly, and professional. Always suggest booking an expert for complex issues.
        Context: ${JSON.stringify(context)}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return {
        success: true,
        response: response.choices[0].message.content,
        suggestions: this.extractSuggestions(response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      return this.simpleChatbotResponse(userMessage, context);
    }
  }

  // Simple chatbot response (fallback)
  static simpleChatbotResponse(userMessage, context = {}) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('plumb') || message.includes('pipe') || message.includes('water')) {
      return {
        success: true,
        response: "I can help you find a qualified plumber! Our platform has verified plumbers available for pipe repairs, leak fixes, and other plumbing services. Would you like me to find the best plumber near you?",
        suggestions: ['Book Plumber', 'Find Experts', 'Emergency Service']
      };
    } else if (message.includes('electric') || message.includes('wire') || message.includes('power')) {
      return {
        success: true,
        response: "I can connect you with certified electricians! Our experts handle wiring, power issues, and electrical repairs safely. Would you like to book an electrician?",
        suggestions: ['Book Electrician', 'Find Experts', 'Emergency Service']
      };
    } else if (message.includes('emergency') || message.includes('urgent') || message.includes('help')) {
      return {
        success: true,
        response: "For emergency services, we have experts available 24/7! Use our SOS button for immediate assistance. What type of emergency service do you need?",
        suggestions: ['Emergency Service', 'SOS Button', 'Find Experts']
      };
    } else if (message.includes('price') || message.includes('cost') || message.includes('rate')) {
      return {
        success: true,
        response: "Our pricing is transparent and competitive! Prices vary based on service type, location, and urgency. Would you like to see pricing for a specific service?",
        suggestions: ['Check Pricing', 'Book Service', 'Find Experts']
      };
    } else {
      return {
        success: true,
        response: "I'm here to help you find the right expert for your needs! You can book services, find experts, check pricing, or get emergency help. What would you like to do?",
        suggestions: ['Book a Service', 'Find Experts', 'Check Pricing', 'Emergency Help']
      };
    }
  }

  // Extract action suggestions from AI response
  static extractSuggestions(response) {
    const suggestions = [];
    
    if (response.toLowerCase().includes('book') || response.toLowerCase().includes('service')) {
      suggestions.push('Book a Service');
    }
    if (response.toLowerCase().includes('expert') || response.toLowerCase().includes('find')) {
      suggestions.push('Find Experts');
    }
    if (response.toLowerCase().includes('emergency') || response.toLowerCase().includes('urgent')) {
      suggestions.push('Emergency Service');
    }
    if (response.toLowerCase().includes('price') || response.toLowerCase().includes('cost')) {
      suggestions.push('Check Pricing');
    }

    return suggestions.length > 0 ? suggestions : ['Book a Service', 'Find Experts', 'Get Help'];
  }

  // Voice search processing
  static async processVoiceSearch(audioData, language = 'en') {
    try {
      // If OpenAI is not available, return error
      if (!openai) {
        return {
          success: false,
          error: 'Voice processing requires OpenAI API key'
        };
      }

      // Convert speech to text (using OpenAI Whisper)
      const transcription = await openai.audio.transcriptions.create({
        file: audioData,
        model: "whisper-1",
        language: language
      });

      // Process the transcribed text
      const processedText = transcription.text;
      
      // Extract intent and entities
      const intent = await this.extractIntent(processedText);
      
      return {
        success: true,
        text: processedText,
        intent,
        language
      };
    } catch (error) {
      console.error('Voice processing error:', error);
      return {
        success: false,
        error: 'Could not process voice input'
      };
    }
  }

  // Extract intent from voice/text input
  static async extractIntent(text) {
    try {
      // If OpenAI is not available, use simple intent extraction
      if (!openai) {
        return this.simpleIntentExtraction(text);
      }

      const prompt = `
        Extract the intent and entities from this text:
        "${text}"
        
        Return JSON with:
        {
          "intent": "book_service|find_expert|emergency|pricing|support",
          "service": "plumber|electrician|etc",
          "urgency": "low|medium|high|emergency",
          "time": "morning|afternoon|evening|specific_time",
          "location": "extracted_location_if_mentioned"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      return this.simpleIntentExtraction(text);
    }
  }

  // Simple intent extraction (fallback)
  static simpleIntentExtraction(text) {
    const lowerText = text.toLowerCase();
    
    let intent = 'book_service';
    let service = 'other';
    let urgency = 'medium';
    let time = 'any';
    let location = null;
    
    // Intent detection
    if (lowerText.includes('find') || lowerText.includes('search')) {
      intent = 'find_expert';
    } else if (lowerText.includes('emergency') || lowerText.includes('urgent')) {
      intent = 'emergency';
    } else if (lowerText.includes('price') || lowerText.includes('cost')) {
      intent = 'pricing';
    } else if (lowerText.includes('help') || lowerText.includes('support')) {
      intent = 'support';
    }
    
    // Service detection
    if (lowerText.includes('plumb') || lowerText.includes('pipe')) {
      service = 'plumber';
    } else if (lowerText.includes('electric') || lowerText.includes('wire')) {
      service = 'electrician';
    } else if (lowerText.includes('carpent') || lowerText.includes('wood')) {
      service = 'carpenter';
    } else if (lowerText.includes('paint')) {
      service = 'painter';
    } else if (lowerText.includes('clean')) {
      service = 'cleaner';
    } else if (lowerText.includes('mechanic') || lowerText.includes('car')) {
      service = 'mechanic';
    }
    
    // Urgency detection
    if (lowerText.includes('emergency') || lowerText.includes('urgent') || lowerText.includes('asap')) {
      urgency = 'emergency';
    } else if (lowerText.includes('quick') || lowerText.includes('fast')) {
      urgency = 'high';
    } else if (lowerText.includes('whenever') || lowerText.includes('flexible')) {
      urgency = 'low';
    }
    
    // Time detection
    if (lowerText.includes('morning')) {
      time = 'morning';
    } else if (lowerText.includes('afternoon')) {
      time = 'afternoon';
    } else if (lowerText.includes('evening')) {
      time = 'evening';
    }
    
    return {
      intent,
      service,
      urgency,
      time,
      location
    };
  }
}

module.exports = AIService;
