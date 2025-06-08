import React from "react";
import {
  MagnifyingGlassIcon,
  StarIcon,
  CheckCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "1",
      title: "Search & Filter",
      description:
        "Use our smart search to find PGs by location, price, amenities, and preferences",
      icon: <MagnifyingGlassIcon className="w-8 h-8 text-purple-600" />,
    },
    {
      step: "2",
      title: "Compare & Review",
      description:
        "View real photos, read authentic reviews, and compare multiple PGs side by side",
      icon: <StarIcon className="w-8 h-8 text-purple-600" />,
    },
    {
      step: "3",
      title: "Visit or Book Online",
      description:
        "Schedule a visit or book instantly online with verified details and zero brokerage",
      icon: <CheckCircleIcon className="w-8 h-8 text-purple-600" />,
    },
    {
      step: "4",
      title: "Move In Hassle-Free",
      description:
        "Complete documentation online and move into your new PG home with full support",
      icon: <HomeIcon className="w-8 h-8 text-purple-600" />,
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How <span className="text-purple-600">Purple PG</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and book your perfect PG in just 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg mx-auto -mt-2">
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-purple-200 transform -translate-y-1/2"></div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
