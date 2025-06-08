import React from "react";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";

interface FeaturedPGsSectionProps {
  nearbyPGs: any[];
  onViewDetails: (pg: any) => void;
  onContactOwner: (pg: any) => void;
}

const FeaturedPGsSection: React.FC<FeaturedPGsSectionProps> = ({
  nearbyPGs,
  onViewDetails,
  onContactOwner,
}) => {
  // Show first 3 nearby PGs or fallback to empty array
  const displayPGs = nearbyPGs.slice(0, 3);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-purple-600">Featured</span> PGs Near You
          </h2>
          <p className="text-xl text-gray-600">
            {nearbyPGs.length > 0
              ? "Handpicked premium PGs with the best ratings and reviews"
              : "Loading nearby PGs..."}
          </p>
        </div>

        {displayPGs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {displayPGs.map((pg, index) => (
              <div
                key={pg._id || index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-6xl">
                    🏠
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-purple-600">
                    {pg.pgGenderType || pg.genderType || "All"}
                  </div>
                  {pg.isAvailable && (
                    <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {pg.propertyName || pg.name || "PG Property"}
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{pg.rentRange?.min || pg.rent || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {pg.address?.area ||
                        pg.address?.city ||
                        pg.address?.line1 ||
                        pg.city ||
                        "Location not specified"}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-900">
                        {pg.rating || 4.5}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm ml-2">
                      ({pg.reviews || 0} reviews)
                    </span>
                  </div>

                  {pg.amenities && pg.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pg.amenities
                        .slice(0, 4)
                        .map((amenity: string, i: number) => (
                          <span
                            key={i}
                            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      {pg.amenities.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          +{pg.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetails(pg)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onContactOwner(pg)}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Contact Owner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Nearby PGs...
            </h3>
            <p className="text-gray-600">
              We're finding the best PGs near your location
            </p>
          </div>
        )}

        {nearbyPGs.length > 3 && (
          <div className="text-center mt-12">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300">
              View All {nearbyPGs.length} PGs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPGsSection;
