import { MapPinIcon } from "@heroicons/react/24/solid";

interface SearchResultsSectionProps {
  hasSearched: boolean;
  searchLocation: string;
  isSearching: boolean;
  searchResults: any[];
  onBackToBrowse: () => void;
  onNewSearch: () => void;
  onViewDetails: (pg: any) => void;
  onContactOwner: (pg: any) => void;
}

const SearchResultsSection = ({
  hasSearched,
  searchLocation,
  isSearching,
  searchResults,
  onBackToBrowse,
  onNewSearch,
  onViewDetails,
  onContactOwner,
}: SearchResultsSectionProps) => {
  if (!hasSearched) return null;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToBrowse}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors"
          >
            ← Back to Browse
          </button>
          <button
            onClick={onNewSearch}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            New Search
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Search Results
          </h2>
          {searchLocation && (
            <div className="text-2xl md:text-3xl font-semibold text-purple-600 break-words px-4">
              in{" "}
              {searchLocation.length > 50
                ? `${searchLocation.substring(0, 50)}...`
                : searchLocation}
            </div>
          )}
          {isSearching ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-xl text-gray-600">Searching for PGs...</p>
            </div>
          ) : (
            <p className="text-xl text-gray-600">
              {searchResults.length > 0
                ? `Found ${searchResults.length} PG${
                    searchResults.length > 1 ? "s" : ""
                  } for you`
                : "No PGs found for your search. Try different location or filters."}
            </p>
          )}
        </div>

        {!isSearching && searchResults.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((pg, index) => (
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
        )}

        {!isSearching && searchResults.length === 0 && hasSearched && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No PGs found
            </h3>
            <p className="text-gray-600 mb-6">
              Try searching for a different location or adjust your filters
            </p>
            <button
              onClick={onNewSearch}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300"
            >
              Start New Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResultsSection;
