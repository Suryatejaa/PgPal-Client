import { StarIcon } from "@heroicons/react/24/solid";

const TestimonialsSection = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Trusted by <span className="text-purple-600">5,000+</span> PG Owners
        </h2>
        <div className="flex justify-center items-center gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
          ))}
          <span className="text-xl font-semibold text-gray-700 ml-2">
            4.9/5 Rating
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Priya Sharma",
            role: "PG Chain Owner, Mumbai",
            avatar: "PS",
            rating: 5,
            text: "Increased my revenue by 45% in 6 months. The tenant management features are incredible!",
            metrics: "12 PGs, ₹15L monthly revenue",
          },
          {
            name: "Amit Patel",
            role: "Property Investor, Pune",
            avatar: "AP",
            rating: 5,
            text: "Best investment for my PG business. ROI was positive within 2 months of using Purple PG.",
            metrics: "8 Properties, 95% occupancy",
          },
          {
            name: "Meera Singh",
            role: "First-time PG Owner, Delhi",
            avatar: "MS",
            rating: 5,
            text: "As a new PG owner, this platform made everything easy. Support team is amazing!",
            metrics: "2 PGs, 98% tenant satisfaction",
          },
        ].map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic text-center">
              "{testimonial.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-xs text-purple-600 font-semibold">
                  {testimonial.metrics}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
