import React from "react";

interface PopularCitiesSectionProps {
  onCityClick: (cityName: string) => void;
}

const PopularCitiesSection: React.FC<PopularCitiesSectionProps> = ({
  onCityClick,
}) => {
  const cities = [
    { name: "Hyderabad", pgs: "1,200+", image: "🏢" },
    { name: "Bangalore", pgs: "1,800+", image: "🌆" },
    { name: "Delhi NCR", pgs: "2,100+", image: "🏙️" },
    { name: "Mumbai", pgs: "1,500+", image: "🌃" },
    { name: "Chennai", pgs: "900+", image: "🏘️" },
    { name: "Pune", pgs: "1,100+", image: "🏗️" },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore PGs in{" "}
            <span className="text-purple-600">Popular Cities</span>
          </h2>
          <p className="text-xl text-gray-600">
            Thousands of verified PGs across India's major cities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div
              key={city.name}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => onCityClick(city.name)}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{city.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {city.name}
                </h3>
                <p className="text-purple-600 font-semibold text-lg">
                  {city.pgs} PGs Available
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCitiesSection;
