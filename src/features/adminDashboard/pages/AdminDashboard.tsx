import React, { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import DashboardChart from "../components/DashboardChart";
import PropertyTable from "../components/PropertyTable";
import RoomTable from "../components/RoomTable";
import UserManagement from "../components/UserManagement";
import ErrorMonitoring from "../components/ErrorMonitoring";
import { propertyService } from "../services/propertyService";
import type {
  DashboardOverview as PropertyOverview,
  Property,
} from "../services/propertyService";
import { roomService } from "../services/roomService";
import type { Room, RoomAnalytics } from "../services/roomService";

// Custom styles for mobile responsiveness
const injectCustomStyles = () => {
  const styleId = "admin-dashboard-mobile-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      @media (max-width: 640px) {
        .xs\\:inline {
          display: inline;
        }
      }
      @media (max-width: 480px) {
        .xs\\:inline {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}
interface AdminDashboardProps {
  userId: string;
  userName: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Load active tab from session storage or default to "overview"
    return sessionStorage.getItem("adminActiveTab") || "overview";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Property Service Data
  const [propertyOverview, setPropertyOverview] =
    useState<PropertyOverview | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  // Room Service Data
  const [roomAnalytics, setRoomAnalytics] = useState<RoomAnalytics | null>(
    null
  );
  const [rooms, setRooms] = useState<Room[]>([]);

  const handleTabChange = (tabId: string) => {
    sessionStorage.setItem("adminActiveTab", tabId);
    setActiveTab(tabId);
  };

  const tabs: TabItem[] = [
    {
      id: "overview",
      name: "Overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "properties",
      name: "Properties",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: "rooms",
      name: "Rooms",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      ),
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "users",
      name: "Users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      id: "monitoring",
      name: "Monitoring",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];
  useEffect(() => {
    // Inject custom styles for mobile responsiveness
    injectCustomStyles();
    loadDashboardData();
  }, []);

  // Update the loadDashboardData function to handle the correct data structure
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Default fallback data
      const defaultPropertyOverview = {
        summary: {
          totalProperties: 0,
          totalActiveProperties: 0,
          totalDeletedProperties: 0,
          totalReviews: 0,
          totalRules: 0,
          totalImages: 0,
          averageViewsPerProperty: 0,
        },
        planDistribution: {},
        recentActivity: {
          recentProperties: [],
          topViewedProperties: [],
        },
        systemMetrics: {
          database: {
            collections: 0,
            dataSize: 0,
            storageSize: 0,
            indexes: 0,
            indexSize: 0,
          },
          cache: {},
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };

      // Updated default fallback data to match API structure
      const defaultRoomAnalytics = {
        totalRooms: 0,
        totalBeds: 0,
        occupiedBeds: 0,
        vacantBeds: 0,
        occupancyRate: 0,
        recentRooms: 0,
        roomsByType: [],
        roomsByStatus: [],
        occupancyStats: [],
        lastUpdated: new Date().toISOString(),
        // Calculated fields for compatibility
        availableRooms: 0,
        occupiedRooms: 0,
        averageRent: 0,
        totalProperties: 0,
      };

      // Load data from both services
      const [
        propertyOverviewData,
        roomAnalyticsResponse,
        propertiesData,
        roomsData,
      ] = await Promise.all([
        propertyService
          .getDashboardOverview()
          .catch(() => defaultPropertyOverview),
        roomService
          .getDashboardOverview()
          .catch(() => ({ data: defaultRoomAnalytics })),
        propertyService
          .getAllProperties({ limit: 10 })
          .catch(() => ({ properties: [], total: 0, page: 1, totalPages: 0 })),
        roomService
          .getAllRooms({ limit: 10 })
          .catch(() => ({ rooms: [], total: 0, page: 1, totalPages: 0 })),
      ]);

      console.log("Room Analytics Response:", roomAnalyticsResponse);

      // Extract the actual data from the nested structure
      const roomAnalyticsData =
        (roomAnalyticsResponse && "data" in roomAnalyticsResponse
          ? roomAnalyticsResponse.data
          : roomAnalyticsResponse) || defaultRoomAnalytics;
      // Calculate additional fields for dashboard compatibility
      const processedRoomAnalytics = {
        ...roomAnalyticsData,
        // Calculate available and occupied rooms from status data
        availableRooms:
          roomAnalyticsData.roomsByStatus?.find(
            (status: any) => status._id === "vacant"
          )?.count || 0,
        occupiedRooms:
          roomAnalyticsData.roomsByStatus?.find(
            (status: any) => status._id === "partially occupied"
          )?.count || 0,
        // Calculate average rent (you might need to get this from rooms data)
        averageRent: 0, // Will be calculated from rooms data
        totalProperties: 1, // Default for now
      };

      // Calculate average rent from rooms data
      if (roomsData.rooms && roomsData.rooms.length > 0) {
        const totalRent = roomsData.rooms.reduce(
          (sum, room) => sum + (room.rentPerBed || 0),
          0
        );
        processedRoomAnalytics.averageRent = Math.round(
          totalRent / roomsData.rooms.length
        );
      }

      setPropertyOverview(propertyOverviewData || defaultPropertyOverview);
      setRoomAnalytics(processedRoomAnalytics);
      setProperties(propertiesData.properties || []);
      setRooms(roomsData.rooms || []);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };
  // Analytics functionality using static data in renderAnalytics function

  const handlePropertyToggleStatus = async (id: string) => {
    try {
      await propertyService.togglePropertyStatus(id);
      loadDashboardData(); // Reload data
    } catch (err) {
      console.error("Failed to toggle property status:", err);
    }
  };

  const handlePropertyDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      try {
        await propertyService.forceDeleteProperty(id);
        loadDashboardData(); // Reload data
      } catch (err) {
        console.error("Failed to delete property:", err);
      }
    }
  };

  const handleRoomBulkUpdate = async (
    roomIds: string[],
    updates: Partial<Room>
  ) => {
    try {
      await roomService.bulkUpdateRooms({ roomIds, updates });
      loadDashboardData(); // Reload data
    } catch (err) {
      console.error("Failed to bulk update rooms:", err);
    }
  };

  const renderOverview = () => {
    const propertyIcons = {
      properties: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      users: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      revenue: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      rooms: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      ),
    };

    return (
      <div className="space-y-6">
        {/* Property Service Stats */}
        {propertyOverview && (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Property Management
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatsCard
                  title="Total Properties"
                  value={(
                    propertyOverview.summary?.totalProperties || 0
                  ).toLocaleString()}
                  icon={propertyIcons.properties}
                />
                <StatsCard
                  title="Active Properties"
                  value={(
                    propertyOverview.summary?.totalActiveProperties || 0
                  ).toLocaleString()}
                  changeType="positive"
                  icon={propertyIcons.properties}
                />
                <StatsCard
                  title="Total Reviews"
                  value={(
                    propertyOverview.summary?.totalReviews || 0
                  ).toLocaleString()}
                  icon={propertyIcons.users}
                />
                <StatsCard
                  title="Total Images"
                  value={(
                    propertyOverview.summary?.totalImages || 0
                  ).toLocaleString()}
                  changeType="positive"
                  icon={propertyIcons.revenue}
                />
              </div>
            </div>
          </>
        )}

        {/* Room Service Stats - Updated to use correct API response structure */}
        {roomAnalytics && (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Room Management
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatsCard
                  title="Total Rooms"
                  value={(roomAnalytics.totalRooms || 0).toLocaleString()}
                  icon={propertyIcons.rooms}
                />
                <StatsCard
                  title="Available Rooms"
                  value={(roomAnalytics.availableRooms || 0).toLocaleString()}
                  changeType="positive"
                  icon={propertyIcons.rooms}
                />
                <StatsCard
                  title="Occupied Rooms"
                  value={(roomAnalytics.occupiedRooms || 0).toLocaleString()}
                  changeType="positive"
                  icon={propertyIcons.rooms}
                />
                <StatsCard
                  title="Occupancy Rate"
                  value={`${(roomAnalytics.occupancyRate || 0).toFixed(1)}%`}
                  icon={propertyIcons.revenue}
                />
              </div>
            </div>

            {/* Additional Room Statistics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Bed Management
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatsCard
                  title="Total Beds"
                  value={(roomAnalytics.totalBeds || 0).toLocaleString()}
                  icon={propertyIcons.rooms}
                />
                <StatsCard
                  title="Occupied Beds"
                  value={(roomAnalytics.occupiedBeds || 0).toLocaleString()}
                  changeType="positive"
                  icon={propertyIcons.rooms}
                />
                <StatsCard
                  title="Available Beds"
                  value={(roomAnalytics.vacantBeds || 0).toLocaleString()}
                  changeType="positive"
                  icon={propertyIcons.rooms}
                />
                <StatsCard
                  title="Average Rent"
                  value={`₹${(
                    roomAnalytics.averageRent || 0
                  ).toLocaleString()}`}
                  icon={propertyIcons.revenue}
                />
              </div>
            </div>
          </>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Recent Properties
            </h3>
            <div className="space-y-3">
              {properties.slice(0, 5).map((property) => (
                <div
                  key={property._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {property.address.city}, {property.address.state}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      ₹{property.rentRange.min.toLocaleString()}-
                      {property.rentRange.max.toLocaleString()}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        property.availableBeds > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {property.availableBeds > 0 ? "Available" : "Full"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Room Statistics by Type
            </h3>
            <div className="space-y-3">
              {roomAnalytics?.roomsByType?.map((typeData, index) => (
                <div
                  key={typeData._id || index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {typeData._id} Rooms
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeData.totalBeds} total beds
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {typeData.count} rooms
                    </p>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {(
                        (typeData.count / roomAnalytics.totalRooms) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProperties = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Property Management
        </h2>
        <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors self-start sm:self-auto">
          Add Property
        </button>
      </div>
      <PropertyTable
        properties={properties}
        loading={loading}
        onToggleStatus={handlePropertyToggleStatus}
        onDelete={handlePropertyDelete}
        onViewDetails={(id) => console.log("View property:", id)}
      />
    </div>
  );
  const renderRooms = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Room Management
        </h2>
        <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors self-start sm:self-auto">
          Add Room
        </button>
      </div>
      <RoomTable
        rooms={rooms}
        loading={loading}
        onBulkUpdate={handleRoomBulkUpdate}
        onViewRoom={(room) => console.log("View room:", room)}
      />
    </div>
  );

  const renderAnalytics = () => {
    const chartData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Properties",
          data: [12, 19, 3, 5, 2, 3],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
        {
          label: "Rooms",
          data: [20, 25, 30, 35, 40, 45],
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
      ],
    };

    const revenueData = {
      labels: ["Properties", "Rooms", "Services"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
          ],
        },
      ],
    };
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <DashboardChart
            type="line"
            data={chartData}
            title="Growth Trends"
            height={300}
          />
          <DashboardChart
            type="pie"
            data={revenueData}
            title="Revenue Distribution"
            height={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <DashboardChart
            type="bar"
            data={chartData}
            title="Monthly Comparison"
            height={300}
          />
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Key Metrics
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">
                  Total Revenue
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  $125,430
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">
                  Average Occupancy
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  78.5%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">
                  Customer Satisfaction
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  4.8/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">
                  Growth Rate
                </span>
                <span className="text-sm sm:text-base font-semibold text-green-600">
                  +12.3%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderUsers = () => <UserManagement />;

  const renderMonitoring = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          System Monitoring
        </h2>
        <div className="text-xs sm:text-sm text-gray-500">
          Real-time gateway and service monitoring
        </div>
      </div>
      <ErrorMonitoring />
    </div>
  );
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "properties":
        return renderProperties();
      case "rooms":
        return renderRooms();
      case "analytics":
        return renderAnalytics();
      case "users":
        return renderUsers();
      case "monitoring":
        return renderMonitoring();
      default:
        return renderOverview();
    }
  };
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-md w-full">
          <div className="text-center">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">
              Error Loading Dashboard
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-4 bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {" "}
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Manage properties and rooms across your platform
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button className="bg-blue-600 text-white px-3 py-2 text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors">
                Export Data
              </button>
              <div className="h-8 w-8 bg-gray-300 rounded-full flex-shrink-0"></div>
            </div>
          </div>
        </div>
      </header>{" "}
      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-center sm:justify-start px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors min-w-0 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0">
                  {tab.icon}
                </span>
                <span className="ml-2 hidden sm:inline truncate">
                  {tab.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>{" "}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
