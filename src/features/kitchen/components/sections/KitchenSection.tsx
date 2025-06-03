import React, { useEffect, useState } from "react";
import {
  getMenus,
  addMenu,
  updateMenu,
  deleteMenu,
  selectMenu,
} from "../../services/kitchenApi";
import AddMealsForm from "../AddMealsForm";
import Modal from "../../Modal";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import GlobalAlert from "../../../../components/GlobalAlert";
import axiosInstance from "../../../../services/axiosInstance";

const KitchenSection = ({ property }: { property: any }) => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [alert, setAlert] = useState<{ message: string; type?: string } | null>(
    null
  );

  // Main section state
  const [activeSection, setActiveSection] = useState(
    () => sessionStorage.getItem("kitchenActiveSection") || "notifications"
  );

  // Menu sub-section state
  const [selectedTab, setSelectedTab] = useState(
    () => sessionStorage.getItem("kitchenSelectedTab") || "selected"
  );

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    menuNo: number | null;
  }>({
    open: false,
    menuNo: null,
  });

  const [selectedMeal, setSelectedMeal] = useState("lunch");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [activeTenants, setActiveTenants] = useState<any[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [automationStates, setAutomationStates] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await getMenus(property.pgpalId);
      console.log(res);
      setMenus(res.data.menus || []);
    } catch (e: any) {
      console.log(e);
      if (e.response.data.message === "No menus found") {
        setAlert(null);
      } else {
        setAlert({
          message: e.response.data.error || "Failed to fetch menus",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Save active section to session storage
    sessionStorage.setItem("kitchenActiveSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    // Save selected tab to session storage
    sessionStorage.setItem("kitchenSelectedTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    if (property?.pgpalId) fetchMenus();
  }, [property?.pgpalId]);

  const handleAddMenu = async (data: any) => {
    try {
      await addMenu(data);
      await fetchMenus();
      setShowForm(false);
      setAlert({ message: "Menu added!", type: "success" });
    } catch (e: any) {
      console.log(data, e);
      setAlert({
        message: e?.response?.data?.error || "Failed to add menu",
        type: "error",
      });
    }
  };

  const handleEditMenu = async (menuNo: number, data: any) => {
    try {
      await updateMenu(property.pgpalId, menuNo, data);
      await fetchMenus();
      setEditingMenu(null);
      setAlert({ message: "Menu updated!", type: "success" });
    } catch (e: any) {
      setAlert({
        message: e?.response?.data?.error || "Failed to update menu",
        type: "error",
      });
    }
  };

  const handleDeleteMenu = async (menuNo: number) => {
    try {
      const res = await deleteMenu(property.pgpalId, menuNo);
      console.log(res.data);
      await fetchMenus();
      setAlert({ message: "Menu deleted!", type: "success" });
    } catch (e: any) {
      console.log("Error deleting menu:", property.pgpalId, menuNo, e);
      setAlert({
        message: e?.response?.data?.error || "Failed to delete menu",
        type: "error",
      });
    }
  };

  const handleSelectMenu = async (menuNo: number) => {
    try {
      await selectMenu(property.pgpalId, menuNo);
      await fetchMenus();
      setAlert({ message: "Menu selected!", type: "success" });
    } catch (e: any) {
      setAlert({
        message: e?.response?.data?.error || "Failed to select menu",
        type: "error",
      });
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/kitchen-service/meal/attendance?propertyPpid=${property.pgpalId}&meal=${selectedMeal}&date=${attendanceDate}`
      );
      const data = await res.json();
      setAttendance(data.attendance || []);
      setActiveTenants(data.totalActiveTenants || []);
      setAlert({ message: "Attendance fetched!", type: "success" });
    } catch (e: any) {
      setAlert({
        message: e?.response?.data?.error || "Failed to fetch attendance",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "attendance") {
      fetchAttendance();
    }
  }, [selectedMeal, attendanceDate, property.pgpalId, activeSection]);

  const sendNotifications = async () => {
    try {
      const res = await axiosInstance.post(
        `/kitchen-service/meal/notifications`,
        {
          propertyPpid: property.pgpalId,
          meal: selectedMeal,
        }
      );
      setAlert({ message: "Notifications sent!", type: "success" });
    } catch (e: any) {
      console.log(e);
      setAlert({
        message: e?.response?.data?.error || "Failed to send notifications",
        type: "error",
      });
    }
  };

  const toggleAutomation = async (mealType: string, enabled: boolean) => {
    try {
      const res = await axiosInstance.put(`/kitchen-service/jobs/status`, {
        propertyPpid: property.pgpalId,
        jobName: mealType,
        enabled: enabled.toString(),
      });
      setAutomationStates((prev) => ({
        ...prev,
        [mealType]: enabled,
      }));
      setAlert({
        message: `Notifications ${
          enabled ? "automated" : "manual"
        } for ${mealType}`,
        type: "success",
      });
    } catch (e: any) {
      console.log(e);
      setAlert({
        message:
          e?.response?.data?.error || "Failed to update automation status",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 1000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  // Main sections configuration
  const sections = [
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "attendance", label: "Attendance", icon: "📊" },
    { key: "menus", label: "Menu Management", icon: "🍽️" },
  ];

  // Menu sub-section logic
  const selectedMenu = menus.find((m) => m.selected);
  const menuTabs = menus
    .filter((m) => !m.selected)
    .map((m) => ({
      key: `menu${m.menuNo}`,
      label: `Menu ${m.menuNo}`,
      menuNo: m.menuNo,
    }));

  let menusToShow: any[] = [];
  if (selectedTab === "selected") {
    if (selectedMenu) menusToShow = [selectedMenu];
  } else {
    const menuNo = Number(selectedTab.replace("menu", ""));
    const found = menus.find((m) => m.menuNo === menuNo);
    if (found) menusToShow = [found];
  }

  // Toggle component
  const Toggle = ({
    enabled,
    onToggle,
    label,
  }: {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          enabled ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const tenantDetails = () => {
    // Map attendance data with active tenants details
    const attendanceWithDetails = attendance.map((attendee: any) => {
      // Find matching tenant from activeTenants array
      const tenant = activeTenants.find(
        (t: any) => t.pgpalId === attendee.tenantPpid
      );

      return {
        tenantPpid: attendee.tenantPpid,
        name: tenant?.name || "Unknown",
        bedId: tenant?.currentStay?.bedId || "Unknown",
        confirmed: attendee.confirmed,
      };
    });

    return attendanceWithDetails;
  };

  useEffect(() => {
    const res = tenantDetails();
    console.log(res);
  }, [attendance, activeTenants]);

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {/* Automation Toggles */}
      <div className="p-1 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Notification Automation Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["breakfast", "lunch", "dinner"].map((mealType) => (
            <div
              key={mealType}
              className="p-1 bg-white rounded-lg shadow-sm border-l-4 border-purple-400"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">
                  {mealType === "breakfast"
                    ? "🌅"
                    : mealType === "lunch"
                    ? "🌞"
                    : "🌙"}
                </span>
                <span className="capitalize font-medium text-gray-700">
                  {mealType}
                </span>
              </div>
              <Toggle
                enabled={
                  automationStates[mealType as keyof typeof automationStates]
                }
                onToggle={(enabled) => toggleAutomation(mealType, enabled)}
                label={
                  automationStates[mealType as keyof typeof automationStates]
                    ? "Automated"
                    : "Manual"
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Manual Notification Controls
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Meal
            </label>
            <select
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">🌞 Lunch</option>
              <option value="dinner">🌙 Dinner</option>
            </select>
          </div>

          {!automationStates[selectedMeal as keyof typeof automationStates] && (
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                &nbsp;
              </label>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                onClick={sendNotifications}
              >
                Send{" "}
                {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}{" "}
                Notifications
              </button>
            </div>
          )}
        </div>

        {automationStates[selectedMeal as keyof typeof automationStates] && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <span className="text-lg">✅</span>
              Notifications are automated for {selectedMeal}. No manual action
              needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendanceSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Meal
          </label>
          <select
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="breakfast">🌅 Breakfast</option>
            <option value="lunch">🌞 Lunch</option>
            <option value="dinner">🌙 Dinner</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex-shrink-0">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            onClick={fetchAttendance}
          >
            Refresh Attendance
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading attendance...</span>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            Attendance for {selectedMeal} on {attendanceDate}
          </h3>
          {attendance.length > 0 ? (
            <>
              <div className="grid gap-2 mb-4 max-h-60 overflow-y-auto">
                {tenantDetails().map((tenant: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-white rounded border-l-4 border-green-400"
                  >
                    <span className="text-green-600">👤</span>
                    <span className="font-medium">{tenant.name}</span>
                    <span className="text-gray-500">({tenant.bedId})</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-800">
                  📈 Total Confirmed: {attendance.length}{" "}
                  {attendance.length === 1 ? "person" : "people"}
                </p>
                <p>
                  Total Active Tenants:{activeTenants.length}{" "}
                  {activeTenants.length === 1 ? "person" : "people"}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <span className="text-3xl block mb-2">📭</span>
              <p>No attendance recorded for this meal and date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMenusSection = () => (
    <div className="space-y-4">
      {/* Menu Sub-tabs */}
      <div className="flex overflow-x-auto bg-purple-100 border-b border-gray-200">
        <button
          className={`px-1 py-2 font-medium transition rounded-none whitespace-nowrap ${
            selectedTab === "selected"
              ? "text-purple-700 border-purple-600 focus:outline-none border-none"
              : "text-gray-600 bg-transparent hover:text-purple-700 "
          }`}
          onClick={() => setSelectedTab("selected")}
        >
          Selected Menu
        </button>
        {menuTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`px-1 py-2 ml-1 whitespace-nowrap rounded-none font-medium transition ${
              selectedTab === tab.key
                ? "text-purple-700 border-none focus:outline-none border-none"
                : "text-gray-600 bg-transparent hover:text-purple-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Menu Button */}
      {menus.length < 4 && (
        <div className="flex justify-end">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-1 py-2 rounded-lg transition-colors duration-200 font-medium"
            onClick={() => setShowForm(true)}
          >
            + Add New Menu
          </button>
        </div>
      )}

      {/* Menu Content */}
      {loading ? (
        <div className="flex items-center justify-center py-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading menus...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {menusToShow.length === 0 && (
            <div className="text-center py-1 text-gray-500">
              <span className="text-3xl block mb-2">📋</span>
              <p>No menu found for this selection.</p>
            </div>
          )}
          {menusToShow.map((menu) => (
            <div
              key={menu.menuNo}
              className={`border rounded-lg p-1 ${
                menu.selected
                  ? "border-purple-600 bg-purple-50 "
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-800">
                    Menu {menu.menuNo}
                  </span>
                  {menu.selected && (
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium">
                      SELECTED
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition"
                    onClick={() => setEditingMenu(menu)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition"
                    onClick={() =>
                      setConfirmDelete({ open: true, menuNo: menu.menuNo })
                    }
                  >
                    🗑️ Delete
                  </button>
                  {!menu.selected && (
                    <button
                      className="text-purple-600 hover:text-purple-800 px-3 py-1 rounded hover:bg-purple-50 transition font-medium"
                      onClick={() => handleSelectMenu(menu.menuNo)}
                    >
                      ✅ Select
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg p-1 border max-h-60 overflow-y-auto">
                {menu.menu
                  .filter((day: any) => day.meals && day.meals.length > 0)
                  .map((day: any) => (
                    <div key={day.day} className="mb-3 last:mb-0">
                      <span className="font-semibold capitalize text-gray-700 text-sm">
                        📅 {day.day}:
                      </span>
                      <div className="ml-4 mt-1 space-y-1">
                        {day.meals.map((meal: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <span className="ml-2 text-gray-700">
                              {meal.items.join(", ")}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {meal.repeatPattern}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full p-1">
      {/* Alert Display */}

      {/* Main Section Navigation */}
      <div className="bg-white shadow -mt-2 pb-1  mb-4">
        <div className="flex border-b border-gray-200 overflow-x-auto bg-purple-300">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-6 py-2 font-medium transition-colors  duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeSection === section.key
                  ? "text-purple-700 border-none border-purple-600 bg-purple-100 rounded-none focus:outline-none focus:border-none"
                  : "text-gray-600 hover:text-purple-700 rounded-none hover:bg-gray-50 bg-purple-300"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
        {alert && (
          <div
            className={`mb-4 p-3 rounded ${
              alert.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Section Content */}
        <div className="p-1">
          {activeSection === "notifications" && renderNotificationsSection()}
          {activeSection === "attendance" && renderAttendanceSection()}
          {activeSection === "menus" && renderMenusSection()}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <AddMealsForm
            propertyPpid={property.pgpalId}
            onSubmit={handleAddMenu}
            onCancel={() => setShowForm(false)}
            availableMenuNumbers={[1, 2, 3, 4].filter(
              (num) => !menus.some((menu) => menu.menuNo === num)
            )}
          />
        </Modal>
      )}

      {editingMenu && (
        <Modal onClose={() => setEditingMenu(null)}>
          <AddMealsForm
            propertyPpid={property.pgpalId}
            initial={editingMenu}
            onSubmit={(data: any) => handleEditMenu(editingMenu.menuNo, data)}
            onCancel={() => setEditingMenu(null)}
            availableMenuNumbers={[1, 2, 3, 4].filter(
              (num) =>
                num === editingMenu.menuNo ||
                !menus.some((menu) => menu.menuNo === num)
            )}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Menu"
        message="Are you sure you want to delete this menu?"
        onConfirm={async () => {
          if (confirmDelete.menuNo !== null) {
            await handleDeleteMenu(confirmDelete.menuNo);
          }
          setConfirmDelete({ open: false, menuNo: null });
        }}
        onCancel={() => setConfirmDelete({ open: false, menuNo: null })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default KitchenSection;
