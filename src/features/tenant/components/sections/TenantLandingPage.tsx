import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import PropertyCardWithReviews from "./PropertyCardWithReviews";
import Modal from "../Modal";
import PGDetailsModal from "./PGDetailsModal";

const gradientBg =
  "bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen";

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

const TenantLandingPage = () => {
  const [search, setSearch] = useState("");
  const [rentMax, setRentMax] = useState("");
  const [depositMax, setDepositMax] = useState("");
  const [pgGenderType, setPgGenderType] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [nearbyPGs, setNearbyPGs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [openReviewsPropertyId, setOpenReviewsPropertyId] = useState<
    string | null
  >(null);
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    if (modalOpen && selectedProperty?._id) {
      // Fetch reviews (already present)
      axiosInstance
        .get(`/property-service/${selectedProperty._id}/reviews`)
        .then((res) => {
          setReviews(res.data.reviews || []);
          setAverageRating(res.data.averageRating ?? null);
        })
        .catch(() => {
          setReviews([]);
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

  useEffect(() => {
    if (modalOpen && selectedProperty?._id) {
      axiosInstance
        .get(`/property-service/${selectedProperty._id}/reviews`)
        .then((res) => {
          setReviews(res.data.reviews || []);
          setAverageRating(res.data.averageRating ?? null);
        })
        .catch(() => {
          setReviews([]);
          setAverageRating(null);
        });
    }
  }, [modalOpen, selectedProperty]);

  // Fetch nearby PGs on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const res = await axiosInstance.get(
            `/property-service/properties/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=5000`
          );
          console.log(`my location: ${latitude}, ${longitude}
            /property-service/properties/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=5000
          `);
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
    <div className={`${gradientBg} flex flex-col items-center pt-5 pb-2`}>
      <div className="w-full max-w-2xl mx-auto mb-5 px-2 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 mb-2 tracking-tight">
          Find Your Next PG 🏠
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover, vibe, and move in. Search by city, state, or PG name!
        </p>
        {/* Searchbar and gender filter always side by side */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-center w-full">
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="🔍 Search by name, city, or state"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 pr-10 rounded-lg border-2 border-purple-300 focus:border-purple-500 outline-none shadow transition"
              autoFocus
            />
            {(search || pgGenderType) && (
              <button
                className="absolute right-0 bg-transparent top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition"
                onClick={() => {
                  setSearch("");
                  setPgGenderType("");
                }}
                tabIndex={-1}
                type="button"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
          <select
            value={pgGenderType}
            onChange={(e) => setPgGenderType(e.target.value)}
            className="px-3 py-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 outline-none shadow transition bg-white flex-shrink-0"
            style={{ minWidth: 120 }}
          >
            {genderTypes.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-4 justify-left mt-1">
          <div className="flex flex-col items-start">
            <label className="text-xs font-semibold text-purple-700 mb-1 ml-1">
              Max Rent (₹)
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 10000"
              className="px-3 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none shadow-sm w-32 transition"
              value={rentMax}
              onChange={(e) => setRentMax(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="text-xs font-semibold text-purple-700 mb-1 ml-1">
              Max Deposit (₹)
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 20000"
              className="px-3 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none shadow-sm w-32 transition"
              value={depositMax}
              onChange={(e) => setDepositMax(e.target.value)}
            />
          </div>
        </div>
        {/* Famous city suggestions */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {famousCities.map((city) => (
            <button
              key={city}
              className="bg-purple-200 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
              onClick={() => setSearch(city)}
              type="button"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center text-purple-700 font-semibold animate-pulse mb-6">
          Searching...
        </div>
      )}

      {search ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-3 text-purple-700 flex items-center gap-2">
            <span role="img" aria-label="sparkles">
              ✨
            </span>
            Search Results
          </h2>
          {sortedResults.length > 0 ? (
            <div className="justify-center">
              {sortedResults.map((property) => (
                <PropertyCardWithReviews
                  key={property._id}
                  property={property}
                  openReviewsPropertyId={openReviewsPropertyId}
                  setOpenReviewsPropertyId={setOpenReviewsPropertyId}
                  handleClickPropertyCard={handleClickPropertyCard}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-6">
              No PGs found. Try a different search!
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
            <span role="img" aria-label="location">
              📍
            </span>
            Nearby PGs
          </h2>
          {nearbyPGs.length > 0 ? (
            <div className="justify-center">
              {nearbyPGs.map((property) => (
                <PropertyCardWithReviews
                  key={property._id}
                  property={property}
                  openReviewsPropertyId={openReviewsPropertyId}
                  setOpenReviewsPropertyId={setOpenReviewsPropertyId}
                  handleClickPropertyCard={handleClickPropertyCard}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-6">
              No nearby PGs found. Try searching or enable location!
            </div>
          )}
        </div>
      )}
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

export default TenantLandingPage;
