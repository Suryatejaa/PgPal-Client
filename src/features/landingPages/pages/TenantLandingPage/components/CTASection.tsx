import React from "react";
import { PhoneIcon } from "@heroicons/react/24/outline";

const CTASection: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Find Your Dream PG?
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          Join 50,000+ students who found their perfect home with Purple PG
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={scrollToTop}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Your Search Now
          </button>
          <div className="flex items-center gap-2 text-purple-200">
            <PhoneIcon className="w-5 h-5" />
            <span>Need help? Call +91-9876543210</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-300">50,000+</div>
            <div className="text-purple-200">Happy Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-300">15,000+</div>
            <div className="text-purple-200">Verified PGs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-300">100+</div>
            <div className="text-purple-200">Cities Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-300">4.8★</div>
            <div className="text-purple-200">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
