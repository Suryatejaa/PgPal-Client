import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/signup');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-700 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Transform Your PG Business?
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          Join thousands of successful PG owners who've increased their revenue
          with Purple PG
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <button
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          onClick={handleStartTrial}
        >
          Start Your Free Trial Now
        </button>
        <div className="flex items-center gap-2 text-purple-200">
          <PhoneIcon className="w-5 h-5" />
          <span>or call +91-9876543210</span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-yellow-300">5,000+</div>
          <div className="text-purple-200">Happy Owners</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-yellow-300">₹500Cr+</div>
          <div className="text-purple-200">Revenue Processed</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-yellow-300">99.9%</div>
          <div className="text-purple-200">Uptime</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-yellow-300">4.9/5</div>
          <div className="text-purple-200">Customer Rating</div>
        </div>
      </div>
    </div>
  </section>
    )
}

export default CTASection;