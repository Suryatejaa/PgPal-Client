import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      location: "Bangalore",
      rating: 5,
      text: "Found my perfect PG in just 2 days! The photos were exactly like reality. Purple PG saved me from broker hassles and fake listings.",
      avatar: "PS",
    },
    {
      name: "Rohit Kumar",
      role: "MBA Student",
      location: "Delhi",
      rating: 5,
      text: "Amazing platform! Zero brokerage and instant booking. The review system helped me choose the best PG with great food and WiFi.",
      avatar: "RK",
    },
    {
      name: "Sneha Patel",
      role: "Graphic Designer",
      location: "Mumbai",
      rating: 5,
      text: "Purple PG's verification process is outstanding. I felt completely safe booking online. The support team helped me throughout the process.",
      avatar: "SP",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our <span className="text-purple-600">Residents Say</span>
          </h2>
          <p className="text-xl text-gray-600">
            Real experiences from thousands of happy PG residents
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-purple-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
