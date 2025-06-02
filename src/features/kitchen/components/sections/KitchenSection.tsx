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

const KitchenSection = ({ property }: { property: any }) => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [alert, setAlert] = useState<{ message: string; type?: string } | null>(
    null
  );
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
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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

  const sendNotifications = async () => {
    try {
      await fetch(`/api/kitchen-service/meal/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyPpid: property.pgpalId,
          meal: selectedMeal,
        }),
      });
      setAlert({ message: "Notifications sent!", type: "success" });
    } catch (e: any) {
      setAlert({
        message: e?.response?.data?.error || "Failed to send notifications",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 3000); // Adjust timeout as needed
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 1000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  // Sub-section bar logic
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

  const availableMenuNumbers = [1, 2, 3, 4].filter(
    (num) => !menus.some((menu) => menu.menuNo === num)
  );

  return (
    <div className="w-full p-4">
      {/* <GlobalAlert
        message={alert?.message || ""}
        type={
          alert?.type === "success" ||
          alert?.type === "error" ||
          alert?.type === "info"
            ? alert.type
            : undefined
        }
        onClose={() => setAlert(null)}
      /> */}

      {/* Notifications and Attendance Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Meal Notifications & Attendance
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-4">
          <select
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3"
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={fetchAttendance}
          >
            View Attendance
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={sendNotifications}
          >
            Send Notifications
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Attendance for {selectedMeal} on {attendanceDate}
            </h3>
            <ul className="list-disc ml-4">
              {attendance.map((tenant: any, idx: number) => (
                <li key={idx}>
                  {tenant.name} ({tenant.roomNumber})
                </li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">
              Total Confirmed: {attendance.length}
            </p>
          </div>
        )}
      </div>

      {/* Menus Section */}
      <div className="bg-white shadow rounded-lg p-4 border-none">
        {/* Sub-section bar */}
        <div
          className="sticky z-20 flex overflow-x-auto text-sm -mt-1 pb-1 bg-purple-300 border-gray-200"
          style={{ top: 139 }}
        >
          <button
            className={`px-3 py-1 rounded-t ${
              selectedTab === "selected"
                ? "bg-transparent text-black rounded-t-md rounded-b-none border-none focus:outline-none"
                : "bg-transparent text-indigo-700 hover:text-purple-700 border-none"
            }`}
            onClick={() => setSelectedTab("selected")}
          >
            Selected Menu
          </button>
          {menuTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-3 py-2 whitespace-nowrap font-semibold transition focus:outline-none
              ${
                selectedTab === tab.key
                  ? "bg-transparent text-black rounded-t-md rounded-b-none border-none"
                  : "bg-transparent text-indigo-700 hover:text-purple-700 border-none"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {alert && (
          <div
            className={`mb-2 text-sm ${
              alert.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {alert.message}
          </div>
        )}

        {menus.length < 4 && (
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Kitchen Menus</h2>
            <button
              className="bg-purple-600 text-white px-3 py-1 rounded-b rounded-t-none"
              onClick={() => setShowForm(true)}
              disabled={menus.length >= 4}
            >
              Add Menu
            </button>
          </div>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4 mt-2 bg-white rounded-xl">
            {menusToShow.length === 0 && (
              <div className="text-gray-500 text-sm">No menu found.</div>
            )}
            {menusToShow.map((menu) => (
              <div
                key={menu.menuNo}
                className={`border-none rounded p-3 relative ${
                  menu.selected ? "border-purple-600" : "border-gray-300"
                }`}
              >
                <div className="flex justify-between bg-white items-center">
                  <div>
                    <span className="font-bold">Menu {menu.menuNo}</span>
                    {menu.selected && (
                      <span className="ml-2 text-purple-600 font-semibold">
                        (Selected)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600"
                      onClick={() => setEditingMenu(menu)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() =>
                        setConfirmDelete({ open: true, menuNo: menu.menuNo })
                      }
                    >
                      Delete
                    </button>
                    {!menu.selected && (
                      <button
                        className="text-purple-600"
                        onClick={() => handleSelectMenu(menu.menuNo)}
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 bg-white">
                  {menu.menu
                    .filter((day: any) => day.meals && day.meals.length > 0) // Only show days with meals
                    .map((day: any) => (
                      <div key={day.day} className="mb-1">
                        <span className="font-semibold capitalize">
                          {day.day}:
                        </span>
                        <ul className="ml-4 list-disc">
                          {day.meals.map((meal: any, idx: number) => (
                            <li key={idx}>
                              <span className="capitalize">{meal.meal}</span>:{" "}
                              {meal.items.join(", ")}{" "}
                              <span className="text-xs text-gray-500">
                                ({meal.repeatPattern})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Menu Modal */}
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

      {/* Edit Menu Modal */}
      {editingMenu && (
        <Modal onClose={() => setEditingMenu(null)}>
          <AddMealsForm
            propertyPpid={property.pgpalId}
            initial={editingMenu}
            onSubmit={(data: any) => handleEditMenu(editingMenu.menuNo, data)}
            onCancel={() => setEditingMenu(null)}
            availableMenuNumbers={
              // Allow the current menu number plus unused numbers
              [1, 2, 3, 4].filter(
                (num) =>
                  num === editingMenu.menuNo ||
                  !menus.some((menu) => menu.menuNo === num)
              )
            }
          />
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
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
