import React, { use, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const AddressSection = ({
  property,
  isOwner,
}: {
  property: any;
  isOwner?: boolean;
}) => {
  const hasCoords =
    property?.location &&
    Array.isArray(property.location.coordinates) &&
    property.location.coordinates.length === 2 &&
    typeof property.location.coordinates[0] === "number" &&
    typeof property.location.coordinates[1] === "number";

  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(
    hasCoords
      ? {
          lat: property.location.coordinates[1],
          lng: property.location.coordinates[0],
        }
      : null
  );
  const [saving, setSaving] = useState(false);
  const [MapPicker, setMapPicker] = useState<React.FC<any> | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const showMissingLocation = !hasCoords && !showMap;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  const customMarkerIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Get user's current location on mount
  React.useEffect(() => {
    if (!userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          () => {
            setUserLocation({ lat: 17.385, lng: 78.4867 }); // fallback to Hyderabad
          }
        );
      } else {
        setUserLocation({ lat: 17.385, lng: 78.4867 }); // fallback
      }
    }
  }, [location, userLocation]);

  // Dynamically import react-leaflet only when needed
  React.useEffect(() => {
    if (showMap && !MapPicker) {
      (async () => {
        const leaflet = await import("react-leaflet");
        await import("leaflet/dist/leaflet.css");
        const { MapContainer, TileLayer, Marker, useMapEvents, useMap } =
          leaflet;

        // TypeScript workaround: cast Marker to any to allow icon prop
        const MarkerAny = Marker as any;

        function LocationMarker({ position, setPosition }: any) {
          useMapEvents({
            click(e: any) {
              setPosition(e.latlng);
            },
          });
          return position ? <MarkerAny position={position} icon={customMarkerIcon} /> : null;
        }

        // Component to handle map panning
        function MapController({ position }: { position: any }) {
          const map = useMap();

          React.useEffect(() => {
            if (position && map) {
              map.setView([position.lat, position.lng], 15);
            }
          }, [position?.lat, position?.lng, map]); // Watch lat/lng individually

          return null;
        }

        const Picker = ({ position, setPosition, userLocation }: any) => {
          const MapContainerAny = MapContainer as any;
          const TileLayerAny = TileLayer as any;
          const [search, setSearch] = React.useState("");
          const [searching, setSearching] = React.useState(false);

          // Function to search location using Nominatim
          const handleSearch = async () => {
            if (!search) return;
            setSearching(true);
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                  search
                )}`
              );
              const data = await res.json();
              if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
              } else {
                alert("Location not found.");
              }
            } catch {
              alert("Error searching location.");
            }
            setSearching(false);
          };

          const mapCenter = position ||
            userLocation || {
              lat: property?.location?.latitude || 17.385,
              lng: property?.location?.longitude || 78.4867,
            };

          return (
            <div className="relative">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Search location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={handleSearch}
                  disabled={searching}
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>
              <MapContainerAny
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={13}
                style={{ height: 300, width: "100%" }}
              >
                {/* <TileLayerAny url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" /> */}
                <TileLayerAny url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={position} setPosition={setPosition} />
                <MapController
                  position={position}
                  key={
                    position ? `${position.lat}-${position.lng}` : "no-position"
                  }
                />
              </MapContainerAny>
              {/* Location button */}
              {userLocation && (
                <button
                  type="button"
                  className="absolute bottom-4 right-4 z-[1000] bg-white rounded-full shadow-lg p-2 border border-purple-300 hover:bg-purple-100 transition"
                  title="Use my current location"
                  onClick={() => setPosition(userLocation)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="4" fill="#3b82f6" />
                    <path
                      stroke="#3b82f6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.42 1.42M6.34 17.66l-1.42 1.42m12.02 0l-1.42-1.42M6.34 6.34L4.92 4.92"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        };
        setMapPicker(() => Picker);
      })();
    }
  }, [
    showMap,
    MapPicker,
    userLocation,
    property?.location?.latitude,
    property?.location?.longitude,
  ]);

  const handleSaveLocation = async () => {
    if (!location) return;
    setSaving(true);
    try {
      const res = await axiosInstance.put(
        `/property-service/properties/${property._id}/location`,
        location
      );
      if (property.location) {
        property.location.coordinates = [location.lng, location.lat];
      } else {
        property.location = { coordinates: [location.lng, location.lat] };
      }
      setShowMap(false);
    } catch (err: any) {
      console.log(err, location);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 text-gray-800">
      <div>
        <strong>Plot Number:</strong> {property.address?.plotNumber}
      </div>
      <div>
        <strong>Line 1:</strong> {property.address?.line1}
      </div>
      <div>
        <strong>Line 2:</strong> {property.address?.line2}
      </div>
      <div>
        <strong>Street:</strong> {property.address?.street}
      </div>
      <div>
        <strong>City:</strong> {property.address?.city}
      </div>
      <div>
        <strong>State:</strong> {property.address?.state}
      </div>
      <div>
        <strong>Country:</strong> {property.address?.country}
      </div>
      <div>
        <strong>Zip Code:</strong> {property.address?.zipCode}
      </div>
      {showMissingLocation && (
        <div className="bg-yellow-100 mt-2 border border-yellow-400 text-yellow-800 rounded px-4 py-2 mb-2 text-center">
          <strong>Location not set.</strong> <br />
          {isOwner
            ? "Please update the property location using the button below."
            : "Owner has not provided the property location yet."}
        </div>
      )}
      {location && !showMissingLocation && (
        <div className="mt-2">
          <strong>Location:</strong>{" "}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Map
          </a>
        </div>
      )}
      {isOwner && (
        <div className="mt-2">
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded"
            onClick={() => {
              setShowMap((v) => {
                if (!v && !location && userLocation) {
                  setLocation(userLocation);
                }
                return !v;
              });
            }}
          >
            {location ? "Update Location" : "Set Location"}
          </button>
        </div>
      )}
      {showMap && MapPicker && (
        <div className="mt-4">
          <MapPicker
            key={
              userLocation
                ? `${userLocation.lat},${userLocation.lng}`
                : "no-location"
            }
            position={location}
            setPosition={setLocation}
            userLocation={userLocation}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={handleSaveLocation}
              disabled={saving || !location}
            >
              {saving ? "Saving..." : "Save Location"}
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
              onClick={() => setShowMap(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
