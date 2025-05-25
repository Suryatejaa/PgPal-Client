import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosInstance";
import PropertyCard from "../../property/components/PropertyCard";

const gradientBg =
  "bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen";

const genderTypes = [
  { label: "All", value: "" },
  { label: "Ladies", value: "ladies" },
  { label: "Gents", value: "gents" },
  { label: "Colive", value: "unisex" },
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
  const [pgGenderType, setPgGenderType] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [nearbyPGs, setNearbyPGs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
              console.log(`my location: ${latitude}, ${longitude}`);
          setNearbyPGs(res.data || []);
        },
        () => {
          // fallback: Hyderabad
          axiosInstance
            .get(`/property-service/nearby?latitude=17.385&longitude=78.4867`)
            .then((res) => setNearbyPGs(res.data || []));
        }
      );
    }
  }, []);

  // Filter search results by gender type on the client
  const filteredResults = useMemo(() => {
    if (!pgGenderType) return searchResults;
    return searchResults.filter(
      (p) =>
        (p.pgGenderType || p.genderType || "").toLowerCase() ===
        pgGenderType.toLowerCase()
    );
  }, [searchResults, pgGenderType]);

  return (
    <div className={`${gradientBg} flex flex-col items-center py-10`}>
      <div className="w-full max-w-2xl mx-auto mb-10 px-2 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 mb-2 tracking-tight">
          Find Your Next PG 🏠
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover, vibe, and move in. Search by city, state, or PG name!
        </p>
        {/* Searchbar and gender filter always side by side */}
        <div className="flex gap-3 items-center justify-center w-full">
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="🔍 Search by name, city, or state"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 pr-10 rounded-full border-2 border-purple-300 focus:border-purple-500 outline-none shadow transition"
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
            className="px-4 py-3 rounded-full border-2 border-purple-300 focus:border-purple-500 outline-none shadow transition bg-white flex-shrink-0"
            style={{ minWidth: 120 }}
          >
            {genderTypes.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        {/* Famous city suggestions */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {famousCities.map((city) => (
            <button
              key={city}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold transition"
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
          {filteredResults.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {filteredResults.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onClick={() => {
                    /* handle property click */
                  }}
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
          <h2 className="text-xl font-bold mt-8 mb-3 text-blue-700 flex items-center gap-2">
            <span role="img" aria-label="location">
              📍
            </span>
            Nearby PGs
          </h2>
          {nearbyPGs.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {nearbyPGs.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onClick={() => {
                    /* handle property click */
                  }}
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
    </div>
  );
};

export default TenantLandingPage;
