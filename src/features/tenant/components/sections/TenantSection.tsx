import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import GlobalAlert from "../../../../components/GlobalAlert";
import axiosInstance from "../../../../services/axiosInstance";
import AddTenant from "../AddTenant";
import RemoveTenantForm from "../RemoveTenant";
import TenantFilterBar from "../filters/TenantFilterBar";
import PastTenantsList from "../filters/PastTenantsList";
import InactiveTenantsList from "../filters/InactiveTenantsList";
import { retainTenant } from "../../services/tenantApi";
import TenantListByFloor from "./TenantListByFloor";

import {
  fetchTenants,
  fetchVacateHistory,
  addTenant,
  removeTenant,
  updateRent,
} from "../../services/tenantApi";

const TENANT_FILTERS = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Notice Period" },
  { key: "paid", label: "Rent Paid" },
  { key: "unpaid", label: "Rent Unpaid" },
  { key: "past", label: "Past Tenants" },
];

const TenantSection = ({
  property,
  userId,
  requestedUsers,
  goToApprovals,
}: {
  property: any;
  userId: string;
  requestedUsers?: any[];
  goToApprovals: () => void;
}) => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [vacates, setVacates] = useState<any[]>([]);
  const [filter, setFilter] = useState(
    () => sessionStorage.getItem("tenantFilter") || "active"
  );
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  if (!property || !property._id) {
    return (
      <div className="text-red-500 text-center mt-4">
        Property not found or invalid property ID.
      </div>
    );
  }

  const [rooms, setRooms] = useState<any[]>([]);
  const [removingTenantId, setRemovingTenantId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roomsFound, setRoomsFound] = useState(false);

  useEffect(() => {
    // Save filter to session storage
    sessionStorage.setItem("tenantFilter", filter);
  }, [filter]);

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get(
        `/room-service/${property._id}/rooms`
      );
      setRooms(res.data.rooms || []);
      setRoomsFound(true);
    } catch (err: any) {
      if (err.response.data.error === "No rooms found") {
        setRoomsFound(false);
      }
      setRooms([]);
    }
  };

  useEffect(() => {
    if (property?._id) fetchRooms();
  }, [property?._id]);

  // Remove tenant handler
  const handleRemoveTenant = async (tenantId: string, data: any) => {
    try {
      const res = await removeTenant(tenantId, data);
      console.log(res);
      setAlert({ message: "Tenant removed successfully", type: "success" });
      setRemovingTenantId(null);
      fetchData();
    } catch (err: any) {
      console.log(err);
      setAlert({ message: "Failed to remove tenant", type: "error" });
    }
  };

  const [retainConfirm, setRetainConfirm] = useState<any | null>(null);

  const handleRetainTenant = async (vacate: any) => {
    try {
      // console.log(vacate)
      // ✅ Use the roomId and bedId from the vacate record being shown
      const res = await retainTenant(vacate);
      console.log(res);
      setAlert({ message: "Tenant retained successfully", type: "success" });
      setRetainConfirm(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setAlert({ message: "Failed to retain tenant", type: "error" });
    }
  };

  // Fetch tenants and vacate history
  const fetchData = async () => {
    try {
      const res = await fetchTenants(property.pgpalId);
      setTenants(res.data || []);
    } catch (err: any) {
      if (err.response.data.error === "Tenant not found") {
        setAlert({
          message: "No tenants found for this property",
          type: "info",
        });
      } else {
        setAlert({ message: "Failed to fetch tenants", type: "error" });
      }
      setTenants([]);
    }

    try {
      const vacateRes = await fetchVacateHistory(property.pgpalId);
      console.log(vacateRes.data);
      setVacates(
        Array.isArray(vacateRes.data.vacateHistory)
          ? vacateRes.data.vacateHistory
          : []
      );
    } catch {
      setVacates([]);
    }
  };

  useEffect(() => {
    if (property?.pgpalId) fetchData();
    // eslint-disable-next-line
  }, [property?.pgpalId]);

  // Filter tenants
  const filteredTenants = tenants.filter((t) => {
    if (filter === "active")
      return t.status === "active" && !t.In_Notice_Period;
    if (filter === "inactive") {
      // console.log(t.status === "active" && t.In_Notice_Period);
      return t.status === "active" && t.In_Notice_Period;
    }
    if (filter === "paid") return t.currentStay?.rentPaidStatus === "paid";
    if (filter === "unpaid") return t.currentStay?.rentPaidStatus === "unpaid";
    return false;
  });

  const roomPgpalIdToFloor: Record<string, string> = React.useMemo(() => {
    const map: Record<string, string> = {};
    rooms.forEach((room) => {
      if (room.pgpalId && room.floor !== undefined) {
        map[room.pgpalId] = String(room.floor);
      }
    });
    return map;
  }, [rooms]);

  const tenantsByFloor: Record<string, any[]> = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredTenants.forEach((tenant) => {
      const roomPgpalId = tenant.currentStay?.roomPpid;
      const floor = roomPgpalIdToFloor[roomPgpalId] || "Unknown";
      if (!groups[floor]) groups[floor] = [];
      groups[floor].push(tenant);
    });
    return groups;
  }, [filteredTenants, roomPgpalIdToFloor]);

  // Add tenant handler
  const handleAddTenant = async (tenantData: any) => {
    try {
      const res = await addTenant(tenantData);
      setAlert({ message: "Tenant added successfully", type: "success" });
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setAlert({
        message: err.response?.data?.error || "Failed to add tenant",
        type: "error",
      });
    }
  };

  const occupiedBeds = tenants
    .filter((t) => t.currentStay?.bedId && t.pgpalId)
    .map((t) => ({
      bedId: t.currentStay.bedId,
      tenantId: t.pgpalId,
    }));
  // console.log(occupiedBeds)

  function matchesSearch(item: any) {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.roomId && item.roomId.toLowerCase().includes(q)) ||
      (item.bedId && item.bedId.toLowerCase().includes(q)) ||
      (item.currentStay?.bedId &&
        item.currentStay.bedId.toLowerCase().includes(q)) ||
      (item.pgpalId && item.pgpalId.toLowerCase().includes(q)) ||
      (item.tenantId && item.tenantId.toLowerCase().includes(q))
    );
  }

  // For active/inactive/paid/unpaid
  const filteredTenantsWithSearch = filteredTenants.filter(matchesSearch);
  const filteredVacatesWithSearch = (vacates || []).filter(matchesSearch);
  const filteredInactiveVacatesWithSearch = (vacates || [])
    .filter((v) => {
      return v.status === "noticeperiod";
    })
    .filter(matchesSearch);

  // console.log(filteredInactiveVacatesWithSearch);

  const tenantsByFloorFiltered = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredTenantsWithSearch.forEach((tenant) => {
      const roomPgpalId = tenant.currentStay?.roomPpid;
      const floor = roomPgpalIdToFloor[roomPgpalId] || "Unknown";
      if (!groups[floor]) groups[floor] = [];
      groups[floor].push(tenant);
    });
    return groups;
  }, [filteredTenantsWithSearch, roomPgpalIdToFloor]);

  const getTenantFilterCount = (key: string) => {
    if (key === "active")
      return tenants.filter((t) => t.status === "active" && !t.In_Notice_Period)
        .length;
    if (key === "inactive") {
      return tenants.filter((t) => t.In_Notice_Period).length;
    }
    if (key === "paid")
      return tenants.filter((t) => t.currentStay?.rentPaidStatus === "paid")
        .length;
    if (key === "unpaid")
      return tenants.filter((t) => t.currentStay?.rentPaidStatus === "unpaid")
        .length;
    if (key === "past") return vacates.length;
    return 0;
  };

  return (
    <div className="relative">
      {alert && <GlobalAlert {...alert} onClose={() => setAlert(null)} />}
      {tenants.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          className="absolute right-0 top-8 mt-12 bg-purple-600 text-white px-4 py-1 rounded-b rounded-t-none font-semibold"
        >
          + Add Tenant
        </button>
      )}
      <TenantFilterBar
        filter={filter}
        setFilter={setFilter}
        filterOptions={TENANT_FILTERS.map((opt) => ({
          ...opt,
          label: `${opt.label} (${getTenantFilterCount(opt.key)})`,
        }))}
      />
      <div
        className="sticky z-10 bg-white "
        style={{ top: 180 }} // adjust if needed to stick below filter bar
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, room, or ID"
          className="w-full px-3 py-2 border-none rounded focus:outline-none"
        />
      </div>
      <div className="pt-1">
        {tenants.length === 0 && filter !== "past" && filter !== "inactive" ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 mr-2 py-3 rounded-lg font-semibold mb-4"
              >
                + Add Tenant
              </button>
            )}
            <div className="text-gray-500">No tenants found. Add tenants.</div>
          </div>
        ) : filter === "past" ? (
          <PastTenantsList
            vacates={filteredVacatesWithSearch}
            userId={userId}
          />
        ) : filter === "inactive" ? (
          <InactiveTenantsList
            vacates={filteredInactiveVacatesWithSearch}
            propertyId={property.pgpalId}
            onRetain={(v) => setRetainConfirm(v)}
            occupiedBeds={occupiedBeds}
          />
        ) : (
          <TenantListByFloor
            tenantsByFloor={tenantsByFloorFiltered}
            onRemove={setRemovingTenantId}
            requestedUsers={requestedUsers}
            goToApprovals={goToApprovals}
          />
        )}
      </div>
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <div className="p-1">
            <div className="font-bold text-lg mb-2 text-purple-700">
              Add Tenant
            </div>
            <AddTenant
              propertyId={property._id}
              rooms={rooms}
              onSubmit={handleAddTenant}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </Modal>
      )}
      {removingTenantId && (
        <Modal onClose={() => setRemovingTenantId(null)}>
          <RemoveTenantForm
            onSubmit={(data: any) => handleRemoveTenant(removingTenantId, data)}
            onCancel={() => setRemovingTenantId(null)}
            isVacate={false}
          />
        </Modal>
      )}
      {retainConfirm && (
        <Modal onClose={() => setRetainConfirm(null)} readonly={false}>
          <div className="p-4">
            <div className="font-bold text-lg mb-2 text-purple-700">
              Confirm Retain Tenant
            </div>
            <div className="mb-4">
              Are you sure you want to retain tenant{" "}
              <b>{retainConfirm.tenantId}</b>?
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleRetainTenant(retainConfirm)}
              >
                Yes, Retain
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setRetainConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TenantSection;
