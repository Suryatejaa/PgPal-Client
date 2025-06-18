import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";
import Text from "../../../../components/Text";

import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CameraIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  ArrowRightIcon,
  MapPinIcon,
  ChartBarIcon,
  CogIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  UsersIcon,
  CreditCardIcon,
  WifiIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

const BaseLandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"owners" | "tenants">("tenants");

  const handleNavigateToOwner = () => {
    // Change APP_TYPE context or navigate to owner-specific route
    window.location.href = "https://owner.purple-pgs.space";
    // OR if using same domain: navigate("/owner-landing");
  };

  const handleNavigateToTenant = () => {
    // Change APP_TYPE context or navigate to tenant-specific route
    window.location.href = "https://tenant.purple-pgs.space";
    // OR if using same domain: navigate("/tenant-landing");
  };

  const handleGetStarted = (userType: "owner" | "tenant") => {
    if (userType === "owner") {
      navigate("/signup");
    } else {
      navigate("/tenant-landing");
    }
  };

  // Statistics
  const stats = [
    { number: "50,000+", label: "Happy Students", color: "text-yellow-400" },
    { number: "15,000+", label: "Verified PGs", color: "text-green-400" },
    { number: "25+", label: "Cities Covered", color: "text-blue-400" },
    { number: "5,000+", label: "PG Owners", color: "text-purple-400" },
  ];

  // Features for both user types
  const tenantFeatures = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-green-600" />,
      title: "100% Verified Properties",
      description:
        "Every PG is personally verified with real photos and accurate details.",
    },
    {
      icon: <CreditCardIcon className="w-8 h-8 text-blue-600" />,
      title: "Zero Brokerage",
      description:
        "Book directly with owners. No hidden charges or broker fees.",
    },
    {
      icon: <UsersIcon className="w-8 h-8 text-purple-600" />,
      title: "Community Reviews",
      description:
        "Real reviews from actual residents to help you decide better.",
    },
    {
      icon: <ClockIcon className="w-8 h-8 text-orange-600" />,
      title: "24/7 Support",
      description: "Our dedicated support team is always available to help.",
    },
  ];

  const ownerFeatures = [
    {
      icon: <ChartBarIcon className="w-8 h-8 text-green-600" />,
      title: "Smart Analytics",
      description:
        "Track occupancy, revenue, and performance with detailed insights.",
    },
    {
      icon: <CogIcon className="w-8 h-8 text-blue-600" />,
      title: "Automated Management",
      description:
        "Streamline operations with automated rent collection and notifications.",
    },
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8 text-purple-600" />,
      title: "Mobile App",
      description:
        "Manage your PG business on-the-go with our mobile application.",
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8 text-orange-600" />,
      title: "Online Presence",
      description: "Get discovered by thousands of students searching for PGs.",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Engineering Student",
      location: "Bangalore",
      text: "Found my perfect PG in just 2 days! The verification process gave me confidence and the zero brokerage saved me ₹15,000.",
      rating: 5,
      avatar: "PS",
      type: "tenant",
    },
    {
      name: "Rajesh Kumar",
      role: "PG Owner",
      location: "Pune",
      text: "Purple PG transformed my business. Revenue increased by ₹2.5L/month and I save 20 hours weekly on management tasks.",
      rating: 5,
      avatar: "RK",
      type: "owner",
    },
    {
      name: "Sneha Patel",
      role: "Working Professional",
      location: "Mumbai",
      text: "The community reviews helped me choose the best PG. Safe, verified, and exactly what I was looking for!",
      rating: 5,
      avatar: "SP",
      type: "tenant",
    },
  ];

  return (
    <div className="min-h-screen font-inter">
      {/* <Header /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <HomeIcon className="w-16 h-16 text-yellow-300" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            India's Leading{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              PG Platform
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-4xl mx-auto leading-relaxed">
            Connecting students with verified PGs and empowering owners with
            smart management tools. Safe, affordable, and convenient
            accommodation for everyone.
          </p>

          {/* User Type Selector */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 max-w-md mx-auto">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("tenants")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "tenants"
                    ? "bg-white text-purple-700 shadow-lg"
                    : "text-black bg-white/20 hover:bg-white/30"
                }`}
              >
                <UserGroupIcon className="w-5 h-5 inline mr-2" />
                For Tenants
              </button>
              <button
                onClick={() => setActiveTab("owners")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "owners"
                    ? "bg-white text-purple-700 shadow-lg"
                    : "text-black bg-white/20 hover:bg-white/30"
                }`}
              >
                <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
                For Owners
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {activeTab === "tenants" ? (
              <>
                <button
                  onClick={handleNavigateToTenant}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Find Your Perfect PG
                  <ArrowRightIcon className="w-5 h-5 inline ml-2" />
                </button>
                <button
                  onClick={handleNavigateToTenant}
                  className="border-2 bg-white text-purple-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-700 transition-all duration-300"
                >
                  Join as Tenant
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleNavigateToOwner}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Free 30-Day Trial
                  <ArrowRightIcon className="w-5 h-5 inline ml-2" />
                </button>
                <button
                  onClick={handleNavigateToOwner}
                  className="border-2 bg-white text-purple-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-700 transition-all duration-300"
                >
                  Join as Owner
                </button>
              </>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-purple-200">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>100% Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CameraIcon className="w-5 h-5" />
              <span>Real Photos</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartIcon className="w-5 h-5" />
              <span>Trusted by 50K+</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-purple-600">Thousands</span>{" "}
              Across India
            </h2>
            <p className="text-xl text-gray-600">
              Join the largest PG community in India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
                >
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {activeTab === "tenants" ? (
                <>
                  Why Students Love{" "}
                  <span className="text-purple-600">Purple PG</span>
                </>
              ) : (
                <>
                  Grow Your Business with{" "}
                  <span className="text-purple-600">Purple PG</span>
                </>
              )}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeTab === "tenants"
                ? "India's most trusted PG booking platform with advanced features and genuine support"
                : "The all-in-one PG management platform that automates operations and maximizes revenue"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(activeTab === "tenants" ? tenantFeatures : ownerFeatures).map(
              (feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-purple-600">Purple PG</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeTab === "tenants"
                ? "Find and book your perfect PG in just 4 simple steps"
                : "Start growing your PG business in minutes"}
            </p>
          </div>

          {activeTab === "tenants" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Search & Filter",
                  description:
                    "Use smart search to find PGs by location, price, and preferences",
                },
                {
                  step: "2",
                  title: "Compare & Review",
                  description:
                    "View real photos, read authentic reviews, and compare options",
                },
                {
                  step: "3",
                  title: "Visit or Book",
                  description:
                    "Schedule a visit or book instantly with zero brokerage",
                },
                {
                  step: "4",
                  title: "Move In",
                  description:
                    "Complete documentation and move into your new home",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Sign Up & Add Property",
                  description:
                    "Register your PG with photos and details in minutes",
                },
                {
                  step: "2",
                  title: "Get Verified",
                  description:
                    "Our team verifies your property for maximum trust",
                },
                {
                  step: "3",
                  title: "Start Earning More",
                  description:
                    "Receive bookings and manage everything effortlessly",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who found success with Purple PG
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-purple-600 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-700 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            {activeTab === "tenants"
              ? "Join 50,000+ students who found their perfect home with Purple PG"
              : "Join 5,000+ successful PG owners growing their business with us"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() =>
                handleGetStarted(activeTab === "tenants" ? "tenant" : "owner")
              }
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {activeTab === "tenants"
                ? "Start Your Search Now"
                : "Start Free Trial"}
            </button>
            <div className="flex items-center gap-2 text-purple-200">
              <PhoneIcon className="w-5 h-5" />
              <span>Need help? Call +91-93463-58559</span>
            </div>
          </div>

          {/* Quick Access Buttons */}
          <div className="border-t border-purple-400 pt-8">
            <p className="text-purple-200 mb-6">Quick Access:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleNavigateToTenant}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Tenant Portal
              </button>
              <button
                onClick={handleNavigateToOwner}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Owner Portal
              </button>
              {/* <button
                onClick={() =>
                  window.open("https://admin.purple-pgs.space", "_blank")
                }
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Admin Portal
              </button> */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BaseLandingPage;
