import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import CurrentStayHeader from "./CurrentStayHeader";


const SECTION_LIST = [
  { key: "overview", label: "Property Overview" },
  { key: "history", label: "Stay History" },
];

const CurrentStaySection = ({ stay, profile }: { stay: any; profile: any }) => {
  const lat = stay.location?.coordinates?.[1];
  const lng = stay.location?.coordinates?.[0];
  const hasCoords =
    lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng);

  const [selectedSection, setSelectedSection] = useState("overview");
  const [overview, setOverview] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedSection === "overview" && stay.propertyPpid) {
      axiosInstance
        .get(`/property-service/property-ppid/${stay.propertyPpid}`)
        .then((res) => setOverview(res.data))
        .catch(() => setOverview(null));
    }
    if (selectedSection === "history" && profile?.pgpalId) {
      axiosInstance
        .get(`/tenant-service/tenant-history?ppid=${profile.pgpalId}`)
        .then((res) => setHistory(res.data))
        .catch(() => setHistory([]));
    }
  }, [selectedSection, stay.propertyPpid, profile?.pgpalId]);

  return (
    <div className="bg-purple-300 text-black rounded-xl p-6 mb-8">
      <CurrentStayHeader
        stay={stay}
        hasCoords={hasCoords}
        lat={lat}
        lng={lng}
      />      
    </div>
  );
};

export default CurrentStaySection;
