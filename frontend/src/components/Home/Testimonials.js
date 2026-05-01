import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Homeowner',
      location: 'Mumbai',
      rating: 5,
      text: 'The AI matching was incredible! It found the perfect plumber for my complex bathroom renovation. The real-time tracking kept me informed every step of the way.',
      avatar: '👩',
      service: 'Plumbing',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      location: 'Delhi',
      rating: 5,
      text: 'As a restaurant owner, I need reliable electrical services. The emergency feature saved me during a power outage. The expert arrived within 30 minutes!',
      avatar: '👨',
      service: 'Electrical',
    },
    {
      id: 3,
      name: 'Anita Patel',
      role: 'Working Professional',
      location: 'Bangalore',
      rating: 5,
      text: 'The video consultation feature is amazing! The electrician helped me fix a simple issue over video call, saving me time and money. Highly recommended!',
      avatar: '👩‍💼',
      service: 'Electrical',
    },
    {
      id: 4,
      name: 'Vikram Singh',
      role: 'Family Man',
      location: 'Pune',
      rating: 5,
      text: 'The community service program is heartwarming. We got our kitchen painted at a discounted rate, and the expert was incredibly professional and kind.',
      avatar: '👨‍👩‍👧‍👦',
      service: 'Painting',
    },
    {
      id: 5,
      name: 'Sneha Reddy',
      role: 'Student',
      location: 'Hyderabad',
      rating: 5,
      text: 'Being a student, the free plan was perfect for my occasional needs. The service quality was excellent, and the experts were very understanding of my budget.',
      avatar: '👩‍🎓',
      service: 'Cleaning',
    },
    {
      id: 6,
      name: 'Amit Gupta',
      role: 'Senior Citizen',
      location: 'Kolkata',
      rating: 5,
      text: 'The voice search in Hindi was a game-changer for me. I could easily book services without typing. The expert was patient and explained everything clearly.',
      avatar: '👴',
      service: 'Carpentry',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say 
            about their experience with ExpertService.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              {/* Service Badge */}
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {testimonial.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-4xl font-bold text-gray-900">4.9</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">Based on 10,000+ customer reviews</p>
            <p className="text-sm text-gray-500">
              Trusted by customers across India for reliable expert services
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;



