import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How does AI matching find the best expert for my job?',
      answer: 'Our AI engine analyzes your exact job description, category, emergency level, geographic location, technician skill badges, customer satisfaction ratings, and current real-time availability to instantly select the single highest-matching verified professional.'
    },
    {
      question: 'Are all service professionals background checked and verified?',
      answer: 'Yes. Every single expert on ExpertService completes rigorous identity checks, police background verification, skill assessment certifications, and ongoing customer rating reviews before being onboarded to our marketplace.'
    },
    {
      question: 'How does real-time technician tracking work?',
      answer: 'Once your booking is accepted, you can track your assigned expert’s live GPS location on the map in real-time right from your browser or app, complete with an accurate estimated time of arrival (ETA).'
    },
    {
      question: 'What happens if I have an urgent emergency home breakdown?',
      answer: 'Clicking the 🚨 Emergency Help button instantly broadcasts your high-priority request to all verified nearby experts within a 5km radius, guaranteeing immediate response and fast dispatch.'
    },
    {
      question: 'Is there a service warranty provided for home repairs?',
      answer: 'Absolutely. All completed jobs booked through ExpertService are backed by our 30-Day Service Warranty. If the same issue reoccurs within 30 days, we send a technician back to fix it for free.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about our AI matching, verified technicians, warranty, and pricing.
          </p>
        </motion.div>

        {/* Accordion Questions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-600 text-white dark:bg-blue-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/40 dark:border-slate-700/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
