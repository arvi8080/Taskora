import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: 0,
      yearlyPrice: 0,
      period: 'forever',
      description: 'Perfect for occasional service needs',
      features: [
        'Basic service booking',
        'Standard support',
        'Basic tracking',
        'Email notifications',
      ],
      limitations: [
        'Limited to 2 bookings per month',
        'Standard response time',
      ],
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      buttonText: 'Get Started Free',
      buttonStyle: 'btn-outline',
    },
    {
      name: 'Basic',
      price: 299,
      yearlyPrice: 239,
      period: 'month',
      description: 'Great for regular service needs',
      features: [
        'Unlimited bookings',
        'Priority support',
        '5% discount on all services',
        'Advanced tracking',
        'SMS notifications',
        'Basic video consultation',
      ],
      limitations: [],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonText: 'Start Basic Plan',
      buttonStyle: 'btn-primary',
      popular: false,
    },
    {
      name: 'Premium',
      price: 599,
      yearlyPrice: 479,
      period: 'month',
      description: 'Best for frequent users',
      features: [
        'Everything in Basic',
        'Premium support',
        '15% discount on all services',
        'Real-time tracking',
        'Video consultations',
        'Emergency priority',
        'Service warranty extension',
        'Priority expert matching',
      ],
      limitations: [],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      buttonText: 'Start Premium Plan',
      buttonStyle: 'btn-primary',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 999,
      yearlyPrice: 799,
      period: 'month',
      description: 'For businesses and organizations',
      features: [
        'Everything in Premium',
        '24/7 dedicated support',
        '25% discount on all services',
        'Custom integrations',
        'Analytics dashboard',
        'Team management',
        'Bulk booking discounts',
        'API access',
        'White-label options',
      ],
      limitations: [],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      buttonText: 'Contact Sales',
      buttonStyle: 'btn-primary',
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as you need more features. All plans include 
            access to our verified experts and quality service guarantee.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isYearly ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={isYearly}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${isYearly ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
              Annual Billing
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative ${plan.bgColor} rounded-2xl p-6 border-2 ${plan.borderColor} hover:shadow-lg transition-all duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className={`text-4xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                    ₹{isYearly ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.price === 0 ? 'forever' : isYearly ? 'mo (billed yearly)' : 'month'}</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="space-y-2 mb-6">
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-500 text-xs">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <Link
                to="/register"
                className={`w-full ${plan.buttonStyle} btn-lg text-center block`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">30-Day Warranty</h4>
                  <p className="text-gray-600 text-sm">All services backed by warranty</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Verified Experts</h4>
                  <p className="text-gray-600 text-sm">All experts are background checked</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Secure Payments</h4>
                  <p className="text-gray-600 text-sm">Safe and secure payment processing</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;



