import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../../../services/axiosInstance";

// Import extracted components
import HeroSection from "../HeroSection";
import SearchResultsSection from "../SearchResultsSection";
import PGDetailsModal from "../PGDetailsModal";
import PopularCitiesSection from "../PopularCitiesSection";
import WhyChooseUsSection from "../WhyChooseUsSection";
import TestimonialsSection from "../TestimonialsSection";
import FeaturedPGsSection from "../FeaturedPGsSection";
import HowItWorksSection from "../HowItWorksSection";
import CTASection from "../CTASection";

// Hero Section Component (moved outside to prevent re-rendering)
const HeroSection = ({
  searchLocation,
  setSearchLocation,
  selectedCategory,
  setSelectedCategory,
  handleSearch,
  isSearching,
}: {
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}) => (
  <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        Find Your Perfect{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">
          PG Home
        </span>
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-4xl mx-auto leading-relaxed">
        Discover verified PGs with photos, reviews, and instant booking. Safe,
        affordable, and convenient accommodation awaits you.
      </p>

      {/* Search Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Enter city, locality, or PG name..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All PGs</option>
            <option value="boys">Boys PG</option>
            <option value="girls">Girls PG</option>
            <option value="colive">Co-living</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <MagnifyingGlassIcon className="w-6 h-6 inline mr-2" />
            {isSearching ? "Searching..." : "Search PGs"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 text-sm text-purple-200">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5" />
          <span>Verified Properties</span>
        </div>
        <div className="flex items-center gap-2">
          <CameraIcon className="w-5 h-5" />
          <span>Real Photos</span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5" />
          <span>Genuine Reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          <span>24/7 Support</span>
        </div>
      </div>
    </div>{" "}
  </section>
);

// PG Details Modal Component
const PGDetailsModal = ({
  pg,
  isOpen,
  onClose,
}: {
  pg: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !pg) return null;

  const handleContactOwner = () => {
    if (pg.contact?.phone) {
      window.open(`tel:${pg.contact.phone}`, "_self");
    }
  };

  const handleWhatsAppContact = () => {
    if (pg.contact?.phone) {
      const message = `Hi, I'm interested in ${pg.name || "your PG"} (ID: ${
        pg.pgpalId
      }). Can you provide more details?`;
      window.open(
        `https://wa.me/91${pg.contact.phone}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {pg.name || "PG Details"}
            </h2>
            <p className="text-purple-600 font-semibold">ID: {pg.pgpalId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Image Placeholder */}
          <div className="h-64 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-8xl mb-6">
            🏠
          </div>

          {/* Property Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Property Details
              </h3>

              <div className="flex items-center gap-3">
                <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Gender Type</p>
                  <p className="text-gray-600 capitalize">{pg.pgGenderType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <HomeIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Accommodation</p>
                  <p className="text-gray-600">
                    {pg.totalBeds} beds in {pg.totalRooms} rooms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Availability</p>
                  <p className="text-gray-600">
                    {pg.availableBeds} beds available
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <EyeIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Views</p>
                  <p className="text-gray-600">{pg.views} people viewed this</p>
                </div>
              </div>
            </div>

            {/* Pricing & Contact */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pricing & Contact
              </h3>

              <div className="flex items-center gap-3">
                <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Rent Range</p>
                  <p className="text-gray-600">
                    ₹{pg.rentRange?.min} - ₹{pg.rentRange?.max} per month
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Security Deposit
                  </p>
                  <p className="text-gray-600">
                    ₹{pg.depositRange?.min} - ₹{pg.depositRange?.max}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Contact</p>
                  <p className="text-gray-600">
                    {pg.contact?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Listed</p>
                  <p className="text-gray-600">
                    {new Date(pg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Address</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {pg.address?.line1}
                  </p>
                  {pg.address?.line2 && (
                    <p className="text-gray-600">{pg.address.line2}</p>
                  )}
                  <p className="text-gray-600">
                    {pg.address?.street && `${pg.address.street}, `}
                    {pg.address?.area && `${pg.address.area}, `}
                    {pg.address?.city}
                  </p>
                  {pg.address?.plotNumber && (
                    <p className="text-sm text-gray-500">
                      Plot: {pg.address.plotNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
            {pg.amenities && pg.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pg.amenities.map((amenity: string, index: number) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleContactOwner}
              disabled={!pg.contact?.phone}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PhoneIcon className="w-5 h-5" />
              Call Owner
            </button>
            <button
              onClick={handleWhatsAppContact}
              disabled={!pg.contact?.phone}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TenantLandingPage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPG, setSelectedPG] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Handle View Details
  const handleViewDetails = (pg: any) => {
    setSelectedPG(pg);
    setIsModalOpen(true);
  };

  // Handle Contact Owner
  const handleContactOwner = (pg: any) => {
    if (pg.contact?.phone) {
      const message = `Hi, I'm interested in ${pg.name || "your PG"} (ID: ${
        pg.pgpalId
      }). Can you provide more details?`;
      window.open(
        `https://wa.me/91${pg.contact.phone}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    } else {
      navigate("/signup");
    }
  };

  // Map category values to match API expectations
  const categoryMapping = {
    all: "",
    boys: "gents",
    girls: "ladies",
    colive: "colive",
  }; // Handle search functionality
  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      alert("Please enter a location to search");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      params.append("query", searchLocation.trim());

      const response = await axiosInstance.get(
        `/property-service/search?${params.toString()}`
      );
      const results = response.data || [];

      // Filter by category if not "all"
      const filteredResults =
        selectedCategory === "all"
          ? results
          : results.filter((property: any) => {
              const propertyGender = (
                property.pgGenderType ||
                property.genderType ||
                ""
              ).toLowerCase();
              return (
                propertyGender ===
                categoryMapping[
                  selectedCategory as keyof typeof categoryMapping
                ]
              );
            });

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }; // Handle city click
  const handleCityClick = async (cityName: string) => {
    setSearchLocation(cityName);
    setSelectedCategory("all");

    // Auto-trigger search when city is clicked
    if (cityName.trim()) {
      setIsSearching(true);
      setHasSearched(true);
      try {
        const params = new URLSearchParams();
        params.append("query", cityName.trim());

        const response = await axiosInstance.get(
          `/property-service/search?${params.toString()}`,
          { headers: { "x-internal-service": "true" } }
        );
        console.log(response.data);
        const results = response.data || [];
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Search Results Section
  const SearchResultsSection = () => {
    if (!hasSearched) return null;

    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                setSearchLocation("");
                setSearchResults([]);
                setHasSearched(false);
                setSelectedCategory("all");
              }}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors"
            >
              ← Back to Browse
            </button>
            <button
              onClick={() => {
                setSearchLocation("");
                setSearchResults([]);
                setHasSearched(false);
                setSelectedCategory("all");
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
            >
              New Search
            </button>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Search Results{" "}
              {searchLocation && (
                <span className="text-purple-600">in {searchLocation}</span>
              )}
            </h2>
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
                    </div>{" "}
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
                    )}{" "}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(pg)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleContactOwner(pg)}
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
                onClick={() => {
                  setSearchLocation("");
                  setSearchResults([]);
                  setHasSearched(false);
                }}
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

  // Popular Cities Section
  const PopularCitiesSection = () => {
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
          </div>{" "}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div
                key={city.name}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleCityClick(city.name)}
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

  // Why Choose Us Section
  const WhyChooseUsSection = () => {
    const features = [
      {
        icon: <ShieldCheckIcon className="w-12 h-12 text-green-600" />,
        title: "100% Verified Properties",
        description:
          "Every PG is personally verified by our team. Real photos, accurate details, and genuine reviews guaranteed.",
        highlight: "Zero fake listings",
      },
      {
        icon: <CreditCardIcon className="w-12 h-12 text-blue-600" />,
        title: "Zero Brokerage",
        description:
          "Book directly with owners. No hidden charges, no broker fees. What you see is what you pay.",
        highlight: "Save thousands",
      },
      {
        icon: <UsersIcon className="w-12 h-12 text-purple-600" />,
        title: "Community Reviews",
        description:
          "Real reviews from actual residents. Make informed decisions based on authentic experiences.",
        highlight: "50,000+ reviews",
      },
      {
        icon: <ClockIcon className="w-12 h-12 text-orange-600" />,
        title: "Instant Booking",
        description:
          "Book your PG in minutes. Quick approval process and immediate confirmation from owners.",
        highlight: "Book in 5 minutes",
      },
      {
        icon: <WifiIcon className="w-12 h-12 text-indigo-600" />,
        title: "Smart Filters",
        description:
          "Filter by amenities, price, location, gender preference, and more to find exactly what you need.",
        highlight: "15+ filters",
      },
      {
        icon: <PhoneIcon className="w-12 h-12 text-red-600" />,
        title: "24/7 Support",
        description:
          "Our dedicated support team is always available to help with any questions or issues.",
        highlight: "Always available",
      },
    ];

    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Students Love{" "}
              <span className="text-purple-600">Purple PG</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              India's most trusted PG booking platform with advanced features
              and genuine support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-lg mb-6 mx-auto">
                  {feature.icon}
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {feature.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Testimonials Section
  const TestimonialsSection = () => {
    const testimonials = [
      {
        name: "Priya Sharma",
        role: "Software Engineer",
        location: "Bangalore",
        rating: 5,
        text: "Found my perfect PG in just 2 days! The photos were exactly like reality. Purple PG saved me from broker hassles and fake listings.",
        avatar: "PS",
      },
      {
        name: "Rohit Kumar",
        role: "MBA Student",
        location: "Delhi",
        rating: 5,
        text: "Amazing platform! Zero brokerage and instant booking. The review system helped me choose the best PG with great food and WiFi.",
        avatar: "RK",
      },
      {
        name: "Sneha Patel",
        role: "Graphic Designer",
        location: "Mumbai",
        rating: 5,
        text: "Purple PG's verification process is outstanding. I felt completely safe booking online. The support team helped me throughout the process.",
        avatar: "SP",
      },
    ];

    return (
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="text-purple-600">Residents Say</span>
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from thousands of happy PG residents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-purple-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
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
    );
  };

  // Featured PGs Section
  const FeaturedPGsSection = () => {
    const featuredPGs = [
      {
        name: "Green Valley PG",
        location: "Koramangala, Bangalore",
        price: "₹8,999",
        rating: 4.8,
        reviews: 124,
        image: "🏠",
        amenities: ["WiFi", "Food", "AC", "Laundry"],
        gender: "Girls Only",
        availability: "3 beds available",
      },
      {
        name: "Urban Living Co-Live",
        location: "Gachibowli, Hyderabad",
        price: "₹12,500",
        rating: 4.9,
        reviews: 89,
        image: "🏢",
        amenities: ["WiFi", "Gym", "Food", "Parking"],
        gender: "Co-living",
        availability: "5 beds available",
      },
      {
        name: "Students Paradise",
        location: "Karol Bagh, Delhi",
        price: "₹7,500",
        rating: 4.6,
        reviews: 156,
        image: "🏘️",
        amenities: ["WiFi", "Food", "Security", "Study Room"],
        gender: "Boys Only",
        availability: "2 beds available",
      },
    ];

    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-purple-600">Featured</span> PGs Near You
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked premium PGs with the best ratings and reviews
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredPGs.map((pg, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-6xl">
                    {pg.image}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-purple-600">
                    {pg.gender}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {pg.availability}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {pg.name}
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {pg.price}
                      </div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{pg.location}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-900">
                        {pg.rating}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm ml-2">
                      ({pg.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pg.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    View Details & Book
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300">
              View All PGs
            </button>
          </div>
        </div>
      </section>
    );
  };

  // How It Works Section
  const HowItWorksSection = () => {
    const steps = [
      {
        step: "1",
        title: "Search & Filter",
        description:
          "Use our smart search to find PGs by location, price, amenities, and preferences",
        icon: <MagnifyingGlassIcon className="w-8 h-8 text-purple-600" />,
      },
      {
        step: "2",
        title: "Compare & Review",
        description:
          "View real photos, read authentic reviews, and compare multiple PGs side by side",
        icon: <StarIcon className="w-8 h-8 text-purple-600" />,
      },
      {
        step: "3",
        title: "Visit or Book Online",
        description:
          "Schedule a visit or book instantly online with verified details and zero brokerage",
        icon: <CheckCircleIcon className="w-8 h-8 text-purple-600" />,
      },
      {
        step: "4",
        title: "Move In Hassle-Free",
        description:
          "Complete documentation online and move into your new PG home with full support",
        icon: <HomeIcon className="w-8 h-8 text-purple-600" />,
      },
    ];

    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-purple-600">Purple PG</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find and book your perfect PG in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg mx-auto -mt-2">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-purple-200 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // CTA Section
  const CTASection = () => (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Find Your Dream PG?
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          Join 50,000+ students who found their perfect home with Purple PG
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            Start Your Search Now
          </button>
          <div className="flex items-center gap-2 text-purple-200">
            <PhoneIcon className="w-5 h-5" />
            <span>Need help? Call +91-9876543210</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-300">50,000+</div>
            <div className="text-purple-200">Happy Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-300">15,000+</div>
            <div className="text-purple-200">Verified PGs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-300">100+</div>
            <div className="text-purple-200">Cities Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-300">4.8★</div>
            <div className="text-purple-200">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
  return (
    <div className="font-sans">
      <HeroSection
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleSearch={handleSearch}
        isSearching={isSearching}
      />
      <SearchResultsSection />
      {!hasSearched && (
        <>
          <PopularCitiesSection />
          <WhyChooseUsSection />
          <FeaturedPGsSection />
          <HowItWorksSection />
          <TestimonialsSection />
        </>
      )}
      <CTASection />

      {/* PG Details Modal */}
      <PGDetailsModal
        pg={selectedPG}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TenantLandingPage;
