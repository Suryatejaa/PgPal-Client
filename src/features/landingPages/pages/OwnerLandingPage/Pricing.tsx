import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useSubscriptionLimits from "../../../../app/useSubscriptionLimits";
import { useNavigate } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../../services/axiosInstance";
import { useLocation } from "react-router-dom";

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

// ...existing imports and code...
const planHierarchy = {
  free: 0,
  trial: 1,
  starter: 2,
  professional: 3,
};

const PricingSection = () => {
  // Move the hook call inside the component
  const { limits: currentUserLimits } = useSubscriptionLimits();
  const navigate = useNavigate();

  const location = useLocation();

  const from = location.state?.from || "profileSidebar";
  const isTrialClaimed = location.state?.isTrialClaimed || false;
  type PlanKey = keyof typeof planConfigurations | "free";
  const currentPlan: PlanKey = location.state?.currentPlan || "free";

  const planHierarchy = {
    free: 0,
    trial: 1,
    starter: 2,
    professional: 3,
  };

  const getAvailablePlans = () => {
    const currentPlanLevel = planHierarchy[currentPlan] || 0;

    return Object.entries(planConfigurations).filter(([planKey, plan]) => {
      const typedPlanKey = planKey as keyof typeof planHierarchy;
      const planLevel = planHierarchy[typedPlanKey] || 0;

      if (planKey === "trial" && isTrialClaimed) {
        return false;
      }

      // Show upgrades (higher tier plans)
      if (planLevel > currentPlanLevel) {
        return true;
      }

      // Special case: Always show starter plan if current plan is professional
      // This allows downgrading from professional to starter for cost savings
      if (currentPlan === "professional" && planKey === "starter") {
        return true;
      }

      return false;
    });
  };

  const availablePlans = getAvailablePlans();

  const handleUpgrade = async (planKey: string) => {
    const isDowngrade =
      planHierarchy[planKey as keyof typeof planHierarchy] <
      planHierarchy[currentPlan];
    const actionText = isDowngrade ? "downgrade" : "upgrade";

    try {
      const response = await axiosInstance.post(
        "auth-service/update-plan",
        {
          currentPlan: planKey,
          subscriptionDuration: 1,
        },
        {
          headers: {
            "x-internal-service": "true",
          },
        }
      );
      //console.log(response);
      if (response.data.message === "Current plan updated successfully.") {
        alert(`Plan ${actionText}d successfully! Refreshing...`);
        navigate("/dashboard");
        window.location.reload();
      } else {
        alert(
          `${
            actionText.charAt(0).toUpperCase() + actionText.slice(1)
          } failed. Please try again.`
        );
      }
    } catch (error) {
      console.error(
        `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} error:`,
        error
      );
      alert(
        `${
          actionText.charAt(0).toUpperCase() + actionText.slice(1)
        } failed. Please try again.`
      );
    }
  };

  // Rest of your existing code remains the same...
  const handleCancelSubscription = async () => {
    try {
      const response = await axiosInstance.post(
        "auth-service/cancel-plan",
        {},
        {
          headers: {
            "x-internal-service": "true",
          },
        }
      );
      //console.log(response);
      if (response.status === 200) {
        alert("Subscription cancelled successfully! Refreshing...");
        navigate("/dashboard");
        window.location.reload();
      } else {
        alert("Cancellation failed. Please try again.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Cancellation failed. Please try again.");
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          {/* Skip button */}
          {from === "register" ? (
            <button
              className="absolute top-4 px-1 rounded-md bg-gray-300 right-4 text-gray-900 hover:text-gray-700"
              onClick={() => handleUpgrade("free")}
            >
              Skip
            </button>
          ) : (
            <button
              className="absolute top-4 bg-gray-300 right-4 text-gray-900 hover:text-gray-700"
              onClick={() => navigate("/dashboard")}
            >
              Close
            </button>
          )}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {currentPlan === "professional"
              ? "Manage Your Plan"
              : "Upgrade Your Plan"}
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {currentPlan === "professional"
              ? "Upgrade to unlock more features or downgrade to save costs."
              : "Choose a higher tier to unlock more features and capabilities."}
          </p>
          <p className="text-lg text-gray-500">
            Current Plan:{" "}
            <span className="font-semibold text-purple-600 capitalize">
              {currentPlan}
            </span>
            <br/>
            <span className="text-gray-400">
              {currentPlan === "free" && isTrialClaimed
                ? "You have already claimed your trial plan."
                : ""}
            </span>
          </p>

          {/* Show message if no upgrades available */}
          {availablePlans.length === 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-2 py-3 rounded-lg mt-6 max-w-md mx-auto">
              <p className="font-semibold">You're on the highest plan!</p>
              <p>You have access to all available features.</p>
            </div>
          )}
        </div>

        {availablePlans.length > 0 && (
          <div
            className={`grid gap-8 ${
              availablePlans.length === 1
                ? "justify-center"
                : availablePlans.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-3"
            }`}
          >
            {availablePlans.map(([planKey, plan]) => {
              const isDowngrade =
                planHierarchy[planKey as keyof typeof planHierarchy] <
                planHierarchy[currentPlan];
              
              // const isUpgrade =
              //   planHierarchy[planKey as keyof typeof planHierarchy] >
              //   planHierarchy[currentPlan];

              return (
                <div
                  key={planKey}
                  className={`rounded-3xl p-10 mt-4 ${
                    plan.popular
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white transform scale-105"
                      : "bg-white border border-gray-200"
                  } relative shadow-xl max-w-md`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold">
                        {plan.highlight}
                      </span>
                    </div>
                  )}

                  {/* Add downgrade/upgrade indicator */}
                  {/* {isDowngrade && (
                    <div className="absolute -top-2 left-4">
                      <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Cost Savings
                      </span>
                    </div>
                  )} */}

                  <div className="text-center mb-3">
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

                    {/* Show cost savings for downgrades */}
                    {isDowngrade && (
                      <p className="text-sm text-orange-600 font-semibold mt-2">
                        Save ₹{2499 - parseInt(plan.price.replace(/[₹,]/g, ""))}{" "}
                        per month
                      </p>
                    )}
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
                                plan.popular
                                  ? "text-green-300"
                                  : "text-green-600"
                              }`}
                            />
                            <span
                              className={
                                plan.popular
                                  ? "text-purple-100"
                                  : "text-gray-700"
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
                      isDowngrade
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : plan.popular
                        ? "bg-white text-purple-600 hover:bg-gray-100"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                    onClick={() => handleUpgrade(planKey)}
                  >
                    {isDowngrade
                      ? `Downgrade to ${plan.name}`
                      : `Upgrade to ${plan.name}`}
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

                  {/* Warning for downgrades */}
                  {isDowngrade && (
                    <p className="text-center text-xs mt-3 text-orange-600">
                      ⚠️ Some features may become unavailable
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {availablePlans.length > 0 && (
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
        )}

        {/* Back to Dashboard button when no upgrades available */}
        {availablePlans.length === 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Cancel Subscription button */}
        {currentPlan !== "free" && (
          <div className="text-center mt-4 border-2 border-red-600 p-6 rounded-lg">
            <button
              onClick={handleCancelSubscription}
              className={`
                bg-red-600 text-white px-6 py-3
                rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-none
              `}
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
