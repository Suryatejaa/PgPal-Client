import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosInstance";
import PropertyCardWithReviews from "../../tenant/components/sections/PropertyCardWithReviews";
import Modal from "../../tenant/components/Modal";
import PGDetailsModal from "../../tenant/components/sections/PGDetailsModal";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const gradientBg =
  "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 min-h-screen";

const genderTypes = [
  { label: "All", value: "" },
  { label: "Ladies", value: "ladies" },
  { label: "Gents", value: "gents" },
  { label: "Colive", value: "colive" },
];

const famousCities = [
  "Hyderabad",
  "Bangalore",
  "Delhi",
  "Mumbai",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

const ExplorePage = () => {
  const [search, setSearch] = useState("");
  const [rentMax, setRentMax] = useState("");
  const [depositMax, setDepositMax] = useState("");
  const [pgGenderType, setPgGenderType] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [nearbyPGs, setNearbyPGs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [openReviewsPropertyId, setOpenReviewsPropertyId] = useState<
    string | null
  >(null);
  const [rules, setRules] = useState<any[]>([]);

  // Load search results from sessionStorage on component mount
  useEffect(() => {
    const savedResults = sessionStorage.getItem("searchResults");
    const savedQuery = sessionStorage.getItem("searchQuery");
    const savedCategory = sessionStorage.getItem("searchCategory");

    if (savedResults && savedQuery) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setSearchResults(parsedResults);
        setSearch(savedQuery);

        // Map category back to ExplorePage format
        if (savedCategory === "boys") setPgGenderType("gents");
        else if (savedCategory === "girls") setPgGenderType("ladies");
        else if (savedCategory === "colive") setPgGenderType("colive");
        else setPgGenderType("");

        // Clear the session storage after loading
        sessionStorage.removeItem("searchResults");
        sessionStorage.removeItem("searchQuery");
        sessionStorage.removeItem("searchCategory");
      } catch (error) {
        console.error(
          "Failed to load search results from session storage:",
          error
        );
      }
    }
  }, []);

  useEffect(() => {
    if (modalOpen && selectedProperty?._id) {
      // Fetch reviews for average rating
      axiosInstance
        .get(`/property-service/${selectedProperty._id}/reviews`)
        .then((res) => {
          setAverageRating(res.data.averageRating ?? null);
        })
        .catch(() => {
          setAverageRating(null);
        });

      // Fetch rules
      axiosInstance
        .get(`/property-service/${selectedProperty._id}/rules`)
        .then((res) => setRules(res.data || []))
        .catch(() => setRules([]));
    }
  }, [modalOpen, selectedProperty]);
  // Debounce search (no gender filter in API call)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.append("query", search.trim());

      if (params.toString()) {
        setLoading(true);
        axiosInstance
          .get(`/property-service/search?${params.toString()}`)
          .then((res) => setSearchResults(res.data || []))
          .finally(() => setLoading(false));
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch nearby PGs on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const res = await axiosInstance.get(
            `/property-service/properties/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=5000`
          );
          // console.log(`my location: ${latitude}, ${longitude}
          //   /property-service/properties/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=5000
          // `);
          setNearbyPGs(res.data || []);
        },
        () => {
          // fallback: Hyderabad
          axiosInstance
            .get(
              `/property-service/nearby?latitude=17.385&longitude=78.4867&maxDistance=5000`
            )
            .then((res) => setNearbyPGs(res.data || []));
        }
      );
    }
  }, []);

  const handleClickPropertyCard = (property: any) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProperty(null);
  };

  // Filter search results by gender type on the client
  const filteredResults = useMemo(() => {
    return searchResults.filter((p) => {
      // Gender filter
      if (
        pgGenderType &&
        (p.pgGenderType || p.genderType || "").toLowerCase() !==
          pgGenderType.toLowerCase()
      ) {
        return false;
      }

      // Rent filter
      const propMinRent = p.rentRange?.min ?? 0;
      if (rentMax && propMinRent > Number(rentMax)) return false;

      // Deposit filter
      const propMinDeposit = p.depositRange?.min ?? 0;
      if (depositMax && propMinDeposit > Number(depositMax)) return false;

      return true;
    });
  }, [searchResults, pgGenderType, rentMax, depositMax]);

  const sortedResults = useMemo(() => {
    return [...filteredResults].sort((a, b) => {
      // First, sort by views (descending)
      if ((b.views ?? 0) !== (a.views ?? 0)) {
        return (b.views ?? 0) - (a.views ?? 0);
      }
      // If views are equal, sort by createdAt (descending, most recent first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredResults]);
  return (
    <div className={`${gradientBg} flex flex-col items-center pt-8 pb-8`}>
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            className="flex items-center gap-2 text-white/80 hover:text-white p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Explore Amazing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">
              PGs
            </span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Already staying? Discover and switch to another PG that perfectly
            fits your lifestyle!
          </p>

          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="🔍 Search by name, city, or state..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
                  autoFocus
                />
                {(search || pgGenderType) && (
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                    onClick={() => {
                      setSearch("");
                      setPgGenderType("");
                    }}
                    tabIndex={-1}
                    type="button"
                    title="Clear"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <select
                value={pgGenderType}
                onChange={(e) => setPgGenderType(e.target.value)}
                className="px-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg bg-white"
                style={{ minWidth: 140 }}
              >
                {genderTypes.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex flex-col items-center">
                <label className="text-xs font-semibold text-white/90 mb-2">
                  Max Rent (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 10000"
                  className="px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg w-36"
                  value={rentMax}
                  onChange={(e) => setRentMax(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-semibold text-white/90 mb-2">
                  Max Deposit (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 20000"
                  className="px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg w-36"
                  value={depositMax}
                  onChange={(e) => setDepositMax(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {famousCities.map((city) => (
              <button
                key={city}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => setSearch(city)}
                type="button"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-purple-100">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>Verified Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <HomeIcon className="w-5 h-5" />
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              <span>Prime Locations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-white font-semibold mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 inline-block">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-lg">Searching for perfect PGs...</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="w-full max-w-6xl mx-auto px-4">
        {search ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <SparklesIcon className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Search Results
              </h2>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                {sortedResults.length} found
              </span>
            </div>
            {sortedResults.length > 0 ? (
              <div className="grid gap-6">
                {sortedResults.map((property) => (
                  <div key={property._id} className="w-full">
                    <PropertyCardWithReviews
                      property={property}
                      openReviewsPropertyId={openReviewsPropertyId}
                      setOpenReviewsPropertyId={setOpenReviewsPropertyId}
                      handleClickPropertyCard={handleClickPropertyCard}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No PGs Found
                </h3>
                <p className="text-gray-500 text-lg">
                  Try adjusting your search criteria or explore nearby PGs below
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <MapPinIcon className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Nearby PGs</h2>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                {nearbyPGs.length} available
              </span>
            </div>
            {nearbyPGs.length > 0 ? (
              <div className="grid gap-6">
                {nearbyPGs.map((property) => (
                  <div key={property._id} className="w-full">
                    <PropertyCardWithReviews
                      property={property}
                      openReviewsPropertyId={openReviewsPropertyId}
                      setOpenReviewsPropertyId={setOpenReviewsPropertyId}
                      handleClickPropertyCard={handleClickPropertyCard}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No Nearby PGs Found
                </h3>
                <p className="text-gray-500 text-lg">
                  Try searching for a specific city or location above
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedProperty && (
        <Modal onClose={closeModal} readonly>
          <PGDetailsModal
            property={selectedProperty}
            averageRating={averageRating}
            rules={rules}
            onCallOwner={() =>
              window.open(`tel:${selectedProperty.contact?.phone}`)
            }
            onNavigate={() =>
              window.open(
                `https://maps.google.com/?q=${selectedProperty.location.coordinates[1]},${selectedProperty.location.coordinates[0]}`
              )
            }
          />
        </Modal>
      )}
    </div>
  );
};

export default ExplorePage;
