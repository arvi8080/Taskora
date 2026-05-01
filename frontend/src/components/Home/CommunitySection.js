import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CommunitySection = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await communityAPI.getOpportunities({ limit: 3 });
      setOpportunities(response.data.opportunities || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load community opportunities');
    }
  };

  const getServiceEmoji = (serviceType) => {
    const emojis = {
      plumbing: '👨‍🔧',
      electrical: '👩‍🔧',
      carpentry: '👨‍🔨',
      cleaning: '🧹',
      painting: '🎨',
      mechanical: '🔧',
      cooking: '👨‍🍳',
      technician: '🖥️',
      default: '🤝'
    };
    return emojis[serviceType.toLowerCase()] || emojis.default;
  };

  const communityStories = opportunities.length > 0 ? opportunities.map((opp, index) => ({
    id: opp._id,
    expert: opp.expert?.name || 'Community Expert',
    service: opp.serviceType,
    story: opp.description || 'Offering community service to help those in need.',
    hours: opp.estimatedHours || 0,
    impact: opp.beneficiaries ? `Helped ${opp.beneficiaries} people` : 'Community Impact',
    image: getServiceEmoji(opp.serviceType),
  })) : [
    {
      id: 1,
      expert: 'Rajesh Kumar',
      service: 'Plumbing',
      story: 'Provided free plumbing services to 5 elderly residents in my neighborhood during the lockdown.',
      hours: 12,
      impact: 'Helped 5 families',
      image: '👨‍🔧',
    },
    {
      id: 2,
      expert: 'Priya Sharma',
      service: 'Electrical',
      story: 'Fixed electrical issues for a local orphanage at no cost, ensuring children\'s safety.',
      hours: 8,
      impact: 'Protected 25 children',
      image: '👩‍🔧',
    },
    {
      id: 3,
      expert: 'Amit Patel',
      service: 'Carpentry',
      story: 'Built furniture for a community center that serves underprivileged children.',
      hours: 20,
      impact: 'Served 100+ children',
      image: '👨‍🔨',
    },
  ];

  const stats = [
    { number: '500+', label: 'Community Hours Served' },
    { number: '150+', label: 'Families Helped' },
    { number: '50+', label: 'Experts Participating' },
    { number: '₹2L+', label: 'Value of Free Services' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
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
            Community Service Program
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our experts volunteer their time and skills to help those in need. 
            Making quality service accessible to everyone, regardless of their financial situation.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Community Stories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {communityStories.map((story, index) => (
            <motion.div
              key={story.id}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{story.image}</div>
                <h3 className="font-semibold text-gray-900">{story.expert}</h3>
                <p className="text-sm text-gray-600">{story.service} Expert</p>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "{story.story}"
              </p>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-1 text-primary-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{story.hours} hours</span>
                </div>
                <div className="text-secondary-600 font-medium">
                  {story.impact}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-soft mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How Community Service Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Experts Volunteer</h4>
              <p className="text-gray-600 text-sm">
                Experts commit to providing free or discounted services to those in need
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Community Requests</h4>
              <p className="text-gray-600 text-sm">
                People in need can request community service through our platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Making Impact</h4>
              <p className="text-gray-600 text-sm">
                Together, we make quality service accessible to everyone in our community
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Join Our Community Service Program
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Whether you're an expert looking to give back or someone in need of help, 
              join our community and make a difference together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/community"
                className="btn-secondary btn-lg px-8 bg-white text-primary-600 hover:bg-gray-100"
              >
                Learn More
              </Link>
              <Link
                to="/register"
                className="btn-outline btn-lg px-8 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;



