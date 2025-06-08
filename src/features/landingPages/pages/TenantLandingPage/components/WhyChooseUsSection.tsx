import React from "react";
import {
  ShieldCheckIcon,
  CreditCardIcon,
  UsersIcon,
  ClockIcon,
  WifiIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-12 h-12 text-green-600" />,
      title: "100% Verified Properties",
      description:
        "Every PG is personally verified by our team. Real photos, accurate details, and genuine reviews guaranteed.",
      highlight: "Zero fake listings",
    },
    {
      icon: <CreditCardIcon className="w-12 h-12 text-blue-600" />,
      title: "Zero Brokerage",
      description:
        "Book directly with owners. No hidden charges, no broker fees. What you see is what you pay.",
      highlight: "Save thousands",
    },
    {
      icon: <UsersIcon className="w-12 h-12 text-purple-600" />,
      title: "Community Reviews",
      description:
        "Real reviews from actual residents. Make informed decisions based on authentic experiences.",
      highlight: "50,000+ reviews",
    },
    {
      icon: <ClockIcon className="w-12 h-12 text-orange-600" />,
      title: "Instant Booking",
      description:
        "Book your PG in minutes. Quick approval process and immediate confirmation from owners.",
      highlight: "Book in 5 minutes",
    },
    {
      icon: <WifiIcon className="w-12 h-12 text-indigo-600" />,
      title: "Smart Filters",
      description:
        "Filter by amenities, price, location, gender preference, and more to find exactly what you need.",
      highlight: "15+ filters",
    },
    {
      icon: <PhoneIcon className="w-12 h-12 text-red-600" />,
      title: "24/7 Support",
      description:
        "Our dedicated support team is always available to help with any questions or issues.",
      highlight: "Always available",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Students Love <span className="text-purple-600">Purple PG</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            India's most trusted PG booking platform with advanced features and
            genuine support
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-lg mb-6 mx-auto">
                {feature.icon}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {feature.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
