import {
  CheckCircleIcon,
  ChartBarIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  PhoneIcon,
  StarIcon,
  BuildingOfficeIcon,
  BellIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const OwnerLandingPage = () => {
  // Hero Section Component
  const HeroSection = () => (
    <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Scale Your PG Business with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Purple PG
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-4xl mx-auto leading-relaxed">
          The all-in-one PG management platform that automates operations,
          maximizes revenue, and delivers exceptional tenant experiences. Join
          5,000+ successful PG owners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            Start Free 30-Day Trial
          </button>
          <button className="border-2 border-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-700 transition-all duration-300">
            Watch Demo (2 min)
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm text-purple-200">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            No Credit Card Required
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            Setup in 15 Minutes
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  );

  // Features Section
  const FeaturesSection = () => (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Run a
            <span className="text-purple-600"> Profitable PG</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From tenant onboarding to revenue optimization, Purple PG handles it
            all
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <ChartBarIcon className="w-12 h-12 text-purple-600" />,
              title: "Smart Analytics Dashboard",
              description:
                "Track occupancy rates, revenue trends, and key metrics with real-time insights that help you make data-driven decisions.",
              stats: "40% faster decision making",
            },
            {
              icon: <CurrencyRupeeIcon className="w-12 h-12 text-green-600" />,
              title: "Automated Rent Collection",
              description:
                "Never chase rent again. Automated reminders, digital payments, and smart tracking reduce collection time by 80%.",
              stats: "99.2% collection rate",
            },
            {
              icon: <UserGroupIcon className="w-12 h-12 text-blue-600" />,
              title: "Tenant Management",
              description:
                "Streamlined onboarding, digital agreements, and 24/7 tenant communication portal for happy, long-term tenants.",
              stats: "60% less tenant turnover",
            },
            {
              icon: (
                <BuildingOfficeIcon className="w-12 h-12 text-indigo-600" />
              ),
              title: "Property Operations",
              description:
                "Manage multiple properties, room assignments, maintenance requests, and compliance from one central hub.",
              stats: "Save 15 hours/week",
            },
            {
              icon: <BellIcon className="w-12 h-12 text-orange-600" />,
              title: "Smart Notifications",
              description:
                "AI-powered alerts for vacant rooms, payment dues, maintenance issues, and growth opportunities.",
              stats: "Zero missed opportunities",
            },
            {
              icon: <DocumentTextIcon className="w-12 h-12 text-red-600" />,
              title: "Digital Documentation",
              description:
                "Paperless contracts, digital KYC, automated compliance, and secure document storage with legal validity.",
              stats: "100% paperless operations",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-semibold">
                {feature.stats}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Benefits Section
  const BenefitsSection = () => (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Increase Revenue by <span className="text-purple-600">35%</span>{" "}
              in 90 Days
            </h2>
            <div className="space-y-6">
              {[
                {
                  metric: "Higher Occupancy Rates",
                  description:
                    "Smart pricing algorithms and tenant matching increase occupancy by 25%",
                  icon: <ChartBarIcon className="w-6 h-6 text-green-600" />,
                },
                {
                  metric: "Faster Rent Collection",
                  description:
                    "Automated systems reduce collection time from 15 days to 3 days",
                  icon: <CurrencyRupeeIcon className="w-6 h-6 text-blue-600" />,
                },
                {
                  metric: "Reduced Operating Costs",
                  description:
                    "Automation cuts administrative costs by 40% and maintenance costs by 30%",
                  icon: (
                    <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
                  ),
                },
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.metric}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">
              Success Story
            </h3>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Rajesh Kumar</h4>
                  <p className="text-gray-600">Owns 3 PGs in Bangalore</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Purple PG transformed my business. Revenue increased by
                ₹2.5L/month, and I save 20 hours weekly. The automated rent
                collection alone pays for the platform."
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">35%</div>
                  <div className="text-sm text-gray-600">Revenue Increase</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Occupancy Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">20h</div>
                  <div className="text-sm text-gray-600">Time Saved/Week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Testimonials Section
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

  // Pricing Section
  const PricingSection = () => (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your PG business. Upgrade or downgrade
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "₹999",
              period: "/month",
              description: "Perfect for single PG owners",
              features: [
                "Up to 20 rooms",
                "Basic tenant management",
                "Rent collection",
                "Mobile app access",
                "Email support",
              ],
              cta: "Start Free Trial",
              popular: false,
            },
            {
              name: "Professional",
              price: "₹2,499",
              period: "/month",
              description: "Most popular for growing businesses",
              features: [
                "Up to 100 rooms",
                "Advanced analytics",
                "Automated workflows",
                "Multi-property management",
                "Priority support",
                "Custom reports",
              ],
              cta: "Start Free Trial",
              popular: true,
            },
            {
              name: "Enterprise",
              price: "₹4,999",
              period: "/month",
              description: "For large PG chains",
              features: [
                "Unlimited rooms",
                "White-label solution",
                "API access",
                "Dedicated account manager",
                "Custom integrations",
                "24/7 phone support",
              ],
              cta: "Contact Sales",
              popular: false,
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white transform scale-105"
                  : "bg-white border border-gray-200"
              } relative shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.popular ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span
                    className={`text-5xl font-bold ${
                      plan.popular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-lg ${
                      plan.popular ? "text-purple-200" : "text-gray-600"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`${
                    plan.popular ? "text-purple-200" : "text-gray-600"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircleIcon
                      className={`w-5 h-5 ${
                        plan.popular ? "text-green-300" : "text-green-600"
                      }`}
                    />
                    <span
                      className={
                        plan.popular ? "text-purple-100" : "text-gray-700"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? "bg-white text-purple-600 hover:bg-gray-100"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include a 30-day free trial • No setup fees • Cancel
            anytime
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span>✓ 99.9% Uptime SLA</span>
            <span>✓ Bank-grade Security</span>
            <span>✓ Regular Feature Updates</span>
          </div>
        </div>
      </div>
    </section>
  );

  // CTA Section
  const CTASection = () => (
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
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
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
  );
  return (
    <div className="min-h-screen font-inter">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default OwnerLandingPage;
