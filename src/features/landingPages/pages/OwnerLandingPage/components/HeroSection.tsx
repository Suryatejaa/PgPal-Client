import { CheckCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();

    const handleStartTrial = () => {
        navigate('/signup');
    };

    return (
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
                    <button
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        onClick={handleStartTrial}
                    >
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
    )
}

export default HeroSection;