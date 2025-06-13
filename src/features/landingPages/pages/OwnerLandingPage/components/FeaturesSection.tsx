import React from 'react'
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BellIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

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
            icon: <BuildingOfficeIcon className="w-12 h-12 text-indigo-600" />,
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

export default FeaturesSection;