import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useSubscriptionLimits from "../../../../../app/useSubscriptionLimits";
import { useNavigate } from "react-router-dom";

const formatLimit = (value: number, label: string) => {
  if (value === -1) return `Unlimited ${label}`;
  return `Up to ${value} ${label}`;
};

const planConfigurations = {
  trial: {
    name: "Trial",
    price: "₹0",
    period: "/30 days",
    description: "Perfect for testing our platform",
    limits: {
      maxProperties: 2,
      maxRoomsPerProperty: 12,
      maxBedsPerProperty: 25,
      maxImagesPerProperty: 10,
      features: [
        "add_property",
        "basic_management",
        "basic_notifications",
        "basic_analytics",
        "view_reviews",
        "manage_amenities",
      ],
    },
    cta: "Start Free Trial",
    popular: false,
    highlight: "30-day free trial",
  },
  starter: {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for single PG owners",
    limits: {
      maxProperties: 5,
      maxRoomsPerProperty: 24,
      maxBedsPerProperty: 70,
      maxImagesPerProperty: 20,
      features: [
        "add_property",
        "basic_management",
        "notifications",
        "analytics",
        "tenant_management",
        "view_reviews",
        "manage_amenities",
        "manage_rules",
        "advanced_search",
      ],
    },
    cta: "Choose Starter",
    popular: true,
    highlight: "Most Popular",
  },
  professional: {
    name: "Professional",
    price: "₹2,499",
    period: "/month",
    description: "For growing PG businesses",
    limits: {
      maxProperties: -1,
      maxRoomsPerProperty: -1,
      maxBedsPerProperty: -1,
      maxImagesPerProperty: -1,
      features: ["all_features"],
    },
    cta: "Choose Professional",
    popular: false,
    highlight: "Unlimited Everything",
  },
};

const PricingSection = () => {
  // Move the hook call inside the component
  const { limits: currentUserLimits } = useSubscriptionLimits();
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate("/signup");
  };

  return (
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
          {Object.entries(planConfigurations).map(([planKey, plan]) => (
            <div
              key={planKey}
              className={`rounded-3xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white transform scale-105"
                  : "bg-white border border-gray-200"
              } relative shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold">
                    {plan.highlight}
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

              {/* Plan Limits Display */}
              <div className="mb-6">
                <h4
                  className={`font-semibold mb-3 ${
                    plan.popular ? "text-purple-200" : "text-gray-700"
                  }`}
                >
                  Plan Limits:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li
                    className={`flex items-center gap-2 ${
                      plan.popular ? "text-purple-100" : "text-gray-600"
                    }`}
                  >
                    <CheckCircleIcon
                      className={`w-4 h-4 ${
                        plan.popular ? "text-green-300" : "text-green-600"
                      }`}
                    />
                    {formatLimit(plan.limits.maxProperties, "properties")}
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      plan.popular ? "text-purple-100" : "text-gray-600"
                    }`}
                  >
                    <CheckCircleIcon
                      className={`w-4 h-4 ${
                        plan.popular ? "text-green-300" : "text-green-600"
                      }`}
                    />
                    {formatLimit(
                      plan.limits.maxRoomsPerProperty,
                      "rooms per property"
                    )}
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      plan.popular ? "text-purple-100" : "text-gray-600"
                    }`}
                  >
                    <CheckCircleIcon
                      className={`w-4 h-4 ${
                        plan.popular ? "text-green-300" : "text-green-600"
                      }`}
                    />
                    {formatLimit(
                      plan.limits.maxBedsPerProperty,
                      "beds per property"
                    )}
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      plan.popular ? "text-purple-100" : "text-gray-600"
                    }`}
                  >
                    <CheckCircleIcon
                      className={`w-4 h-4 ${
                        plan.popular ? "text-green-300" : "text-green-600"
                      }`}
                    />
                    {formatLimit(
                      plan.limits.maxImagesPerProperty,
                      "images per property"
                    )}
                  </li>
                </ul>
              </div>

              {/* Feature List */}
              <div className="mb-8">
                <h4
                  className={`font-semibold mb-3 ${
                    plan.popular ? "text-purple-200" : "text-gray-700"
                  }`}
                >
                  Features Included:
                </h4>
                <ul className="space-y-3">
                  {plan.limits.features.includes("all_features") ? (
                    <li className="flex items-center gap-3">
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
                        All Premium Features
                      </span>
                    </li>
                  ) : (
                    plan.limits.features.map((feature, idx) => (
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
                          {feature
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? "bg-white text-purple-600 hover:bg-gray-100"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                onClick={
                  planKey === "trial"
                    ? handleStartTrial
                    : () => navigate(`/signup`)
                }
              >
                {plan.cta}
              </button>

              {planKey === "trial" && (
                <p
                  className={`text-center text-xs mt-3 ${
                    plan.popular ? "text-purple-200" : "text-gray-500"
                  }`}
                >
                  No credit card required
                </p>
              )}
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
          </div>{" "}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
