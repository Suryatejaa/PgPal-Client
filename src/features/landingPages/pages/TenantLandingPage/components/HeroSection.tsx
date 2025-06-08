import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CameraIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

interface HeroSectionProps {
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}

const HeroSection = ({
  searchLocation,
  setSearchLocation,
  selectedCategory,
  setSelectedCategory,
  handleSearch,
  isSearching,
}: HeroSectionProps) => (
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
    </div>
  </section>
);

export default HeroSection;
