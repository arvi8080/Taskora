import React from 'react';
import { motion } from 'framer-motion';

const Gamification = () => {
  const badges = [
    {
      name: '5-Star Master',
      description: 'Received 5-star ratings for 10+ consecutive jobs',
      icon: '⭐',
      color: 'from-yellow-400 to-yellow-600',
      rarity: 'Legendary',
    },
    {
      name: 'Lightning Fast',
      description: 'Average response time under 5 minutes',
      icon: '⚡',
      color: 'from-blue-400 to-blue-600',
      rarity: 'Epic',
    },
    {
      name: 'Community Hero',
      description: 'Completed 10+ hours of community service',
      icon: '❤️',
      color: 'from-red-400 to-red-600',
      rarity: 'Rare',
    },
    {
      name: 'Reliability Master',
      description: '95%+ completion rate with 20+ jobs',
      icon: '🛡️',
      color: 'from-green-400 to-green-600',
      rarity: 'Epic',
    },
    {
      name: 'Level 10 Expert',
      description: 'Reached the highest expert level',
      icon: '🏆',
      color: 'from-purple-400 to-purple-600',
      rarity: 'Legendary',
    },
    {
      name: 'Weekend Warrior',
      description: 'Completed jobs for 7 consecutive days',
      icon: '🔥',
      color: 'from-orange-400 to-orange-600',
      rarity: 'Rare',
    },
  ];

  const levels = [
    { level: 1, name: 'Beginner', xp: 0, color: 'bg-gray-400' },
    { level: 2, name: 'Apprentice', xp: 100, color: 'bg-green-400' },
    { level: 3, name: 'Skilled', xp: 300, color: 'bg-blue-400' },
    { level: 4, name: 'Professional', xp: 600, color: 'bg-purple-400' },
    { level: 5, name: 'Expert', xp: 1000, color: 'bg-yellow-400' },
    { level: 6, name: 'Master', xp: 1500, color: 'bg-orange-400' },
    { level: 7, name: 'Grandmaster', xp: 2100, color: 'bg-red-400' },
    { level: 8, name: 'Legend', xp: 2800, color: 'bg-pink-400' },
    { level: 9, name: 'Mythic', xp: 3600, color: 'bg-indigo-400' },
    { level: 10, name: 'Transcendent', xp: 4500, color: 'bg-gradient-to-r from-yellow-400 to-red-500' },
  ];

  return (
    <section className="py-20 bg-white">
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
            Gamification for Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our experts earn badges, level up, and get rewarded for excellent service. 
            Better performance leads to better recognition and more opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Badges System */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Achievement Badges
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.name}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center text-2xl`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {badge.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          badge.rarity === 'Legendary' ? 'bg-yellow-100 text-yellow-800' :
                          badge.rarity === 'Epic' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {badge.rarity}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Level System */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Expert Levels
            </h3>
            
            <div className="space-y-3">
              {levels.map((level, index) => (
                <motion.div
                  key={level.level}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-10 h-10 ${level.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {level.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {level.xp} XP
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${level.color} transition-all duration-1000`}
                        style={{ width: `${Math.min(100, (level.xp / 4500) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Level Benefits</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Higher visibility in search results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority booking opportunities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Exclusive rewards and bonuses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced training opportunities</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard Preview */}
        <motion.div
          className="mt-16 bg-gray-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Expert Leaderboard
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { rank: 1, name: 'Rajesh Kumar', level: 10, badges: 15, rating: 4.9, color: 'bg-yellow-400' },
              { rank: 2, name: 'Priya Sharma', level: 9, badges: 12, rating: 4.8, color: 'bg-gray-300' },
              { rank: 3, name: 'Amit Patel', level: 9, badges: 11, rating: 4.8, color: 'bg-orange-400' },
            ].map((expert, index) => (
              <div key={expert.rank} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${expert.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {expert.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{expert.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Level {expert.level}</span>
                      <span>•</span>
                      <span>{expert.badges} badges</span>
                      <span>•</span>
                      <span>{expert.rating}★</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gamification;



