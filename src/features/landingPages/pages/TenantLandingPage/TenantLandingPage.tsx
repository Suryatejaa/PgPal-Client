import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../services/axiosInstance";

// Import extracted components
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import HeroSection from "./components/HeroSection";
import SearchResultsSection from "./components/SearchResultsSection";
import PGDetailsModal from "./components/PGDetailsModal";
import PopularCitiesSection from "./components/PopularCitiesSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FeaturedPGsSection from "./components/FeaturedPGsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";

const TenantLandingPage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPG, setSelectedPG] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nearbyPGs, setNearbyPGs] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch nearby PGs based on user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axiosInstance.get(
              `/property-service/properties/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=5000`,
              {
                headers: { "x-internal-service": "true" },
              }
            );
            //console.log(res);
            //console.log(`my location: ${latitude}, ${longitude}
            // /property-service/properties/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=5000
            // `);
            setNearbyPGs(res.data || []);
          } catch (error) {
            console.error(
              "Failed to fetch nearby PGs with user location:",
              error
            );
            // Try fallback location if API call fails
            try {
              const fallbackRes = await axiosInstance.get(
                `/property-service/properties/nearby?latitude=17.385&longitude=78.4867&maxDistance=5000`
              );
              setNearbyPGs(fallbackRes.data || []);
            } catch (fallbackError) {
              console.error(
                "Failed to fetch nearby PGs with fallback location:",
                fallbackError
              );
              setNearbyPGs([]);
            }
          }
        },
        () => {
          // fallback: Hyderabad
          axiosInstance
            .get(
              `/property-service/properties/nearby?latitude=17.385&longitude=78.4867&maxDistance=5000`
            )
            .then((res) => setNearbyPGs(res.data || []))
            .catch((err) => {
              console.error("Failed to fetch nearby PGs:", err);
              setNearbyPGs([]);
            });
        }
      );
    }
  }, []);

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
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      alert("Please enter a location to search");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      params.append("city", searchLocation.trim());

      //console.log('params:', params.toString());
      const response = await axiosInstance.get(
        `property-service/search?${params.toString()}`
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
    } catch (error: any) {
      //console.log("Search failed:", error.config);
      alert("Search failed. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle city click
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
        //console.log(response.data);
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

  // Reset search function for components
  const resetSearch = () => {
    setSearchLocation("");
    setSearchResults([]);
    setHasSearched(false);
    setSelectedCategory("all");
  };
  return (
    <div className="min-h-screen font-inter">
      <Header />
      <HeroSection
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleSearch={handleSearch}
        isSearching={isSearching}
      />
      <SearchResultsSection
        hasSearched={hasSearched}
        isSearching={isSearching}
        searchLocation={searchLocation}
        searchResults={searchResults}
        onViewDetails={handleViewDetails}
        onContactOwner={handleContactOwner}
        onBackToBrowse={resetSearch}
        onNewSearch={resetSearch}
      />
      {!hasSearched && (
        <>
          <PopularCitiesSection onCityClick={handleCityClick} />
          <WhyChooseUsSection />
          <FeaturedPGsSection
            nearbyPGs={nearbyPGs}
            onViewDetails={handleViewDetails}
            onContactOwner={handleContactOwner}
          />
          <HowItWorksSection />
          <TestimonialsSection />
        </>
      )}
      <CTASection />
      <Footer />
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
