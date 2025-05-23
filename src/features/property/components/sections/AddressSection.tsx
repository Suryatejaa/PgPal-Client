import React, { useState } from "react";
import axiosInstance from "../../../auth/axiosInstance";

const AddressSection = ({
  property,
  isOwner,
}: {
  property: any;
  isOwner?: boolean;
}) => {
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(
    property.location
      ? {
          lat: property.location.lat ?? property.location.latitude,
          lng: property.location.lng ?? property.location.longitude,
        }
      : null
  );
  const [saving, setSaving] = useState(false);
  const [MapPicker, setMapPicker] = useState<React.FC<any> | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  console.log(property.location.latitude, property.location.longitude);
  // Get user's current location on mount
  React.useEffect(() => {
    if (!location && !userLocation) {
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
        const { MapContainer, TileLayer, Marker, useMapEvents } = leaflet;

        function LocationMarker({ position, setPosition }: any) {
          useMapEvents({
            click(e: any) {
              setPosition(e.latlng);
            },
          });
          return position ? <Marker position={position} /> : null;
        }

        // TypeScript workaround: cast imported components to any
        const Picker = ({ position, setPosition }: any) => {
          const MapContainerAny = MapContainer as any;
          const TileLayerAny = TileLayer as any;
          return (
            <MapContainerAny
              center={
                position ||
                userLocation || {
                  lat: property.location.latitude,
                  lng: property.location.longitude,
                } // use device location if available
              }
              zoom={13}
              style={{ height: 300, width: "100%" }}
            >
              <TileLayerAny url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainerAny>
          );
        };
        setMapPicker(() => Picker);
      })();
    }
  }, [showMap, MapPicker, userLocation]);

  const handleSaveLocation = async () => {
    if (!location) return;
    setSaving(true);
    try {
      const res = await axiosInstance.put(
        `/property-service/properties/${property._id}/location`,
        location
      );
      console.log(res, location);
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
      {location && (
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
        <div className="mt-3">
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
          <MapPicker position={location} setPosition={setLocation} />
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
