import React, { useState } from "react";
import Modal from "../Modal";

const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const MEAL_TYPES = ["breakfast", "lunch", "snacks", "dinner"];
const REPEAT_PATTERNS = [
  { value: "weekly", label: "Weekly" },
  { value: "alternateWeeks", label: "Alternate Weeks" },
  { value: "none", label: "None" },
];

const AddMealsForm = ({
  propertyPpid,
  initial,
  onSubmit,
  onCancel,
  availableMenuNumbers,
}: {
  propertyPpid: string;
  initial?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  availableMenuNumbers: number[];
}) => {
  // Initial state setup
  const [menuNo, setMenuNo] = useState(
    initial?.menuNo || availableMenuNumbers?.[0]
  );
  const [date, setDate] = useState(
    initial?.weekStartDate ? initial.weekStartDate.slice(0, 10) : ""
  );
  const [meals, setMeals] = useState<any[]>(
    initial?.menu
      ? initial.menu.map((d: any) => ({
          day: d.day,
          meals: d.meals.map((m: any) => ({
            meal: m.meal,
            items: [...m.items],
            repeatPattern: m.repeatPattern || "weekly",
          })),
        }))
      : []
  );
  const [error, setError] = useState<string | null>(null);

  // Add a new day
  const handleAddDay = () => {
    const unused = WEEK_DAYS.find(
      (d) => !meals.some((day: any) => day.day === d)
    );
    if (unused) {
      setMeals([...meals, { day: unused, meals: [] }]);
    }
  };

  // Remove a day
  const handleRemoveDay = (dayIdx: number) => {
    setMeals(meals.filter((_, idx) => idx !== dayIdx));
  };

  // Add a meal to a day
  const handleAddMeal = (dayIdx: number) => {
    const usedMeals = meals[dayIdx].meals.map((m: any) => m.meal);
    const unused = MEAL_TYPES.find((m) => !usedMeals.includes(m));
    if (unused) {
      const updated = [...meals];
      updated[dayIdx].meals.push({
        meal: unused,
        items: [""],
        repeatPattern: "weekly",
      });
      setMeals(updated);
    }
  };

  // Remove a meal from a day
  const handleRemoveMeal = (dayIdx: number, mealIdx: number) => {
    const updated = [...meals];
    updated[dayIdx].meals.splice(mealIdx, 1);
    setMeals(updated);
  };

  // Update meal type, items, repeatPattern
  const handleMealChange = (
    dayIdx: number,
    mealIdx: number,
    field: string,
    value: any
  ) => {
    const updated = [...meals];
    updated[dayIdx].meals[mealIdx][field] = value;
    setMeals(updated);
  };

  // Add/remove meal items
  const handleAddItem = (dayIdx: number, mealIdx: number) => {
    const updated = [...meals];
    updated[dayIdx].meals[mealIdx].items.push("");
    setMeals(updated);
  };
  const handleRemoveItem = (
    dayIdx: number,
    mealIdx: number,
    itemIdx: number
  ) => {
    const updated = [...meals];
    updated[dayIdx].meals[mealIdx].items.splice(itemIdx, 1);
    setMeals(updated);
  };
  const handleItemChange = (
    dayIdx: number,
    mealIdx: number,
    itemIdx: number,
    value: string
  ) => {
    const updated = [...meals];
    updated[dayIdx].meals[mealIdx].items[itemIdx] = value;
    setMeals(updated);
  };

  // Validation and submit
  const handleSave = () => {
    if (!date) return setError("Please select week start date.");
    if (!meals.length) return setError("Add at least one day.");
    for (const day of meals) {
      if (!day.meals.length)
        return setError(`Add at least one meal for ${day.day}.`);
      for (const meal of day.meals) {
        if (!meal.items.length || meal.items.some((i: string) => !i.trim()))
          return setError(`Add all items for ${day.day} - ${meal.meal}.`);
      }
    }
    setError(null);
    onSubmit({
      propertyPpid,
      date,
      menuNo,
      meals: meals.map((d) => ({
        day: d.day,
        meals: d.meals.map((m: any) => ({
          meal: m.meal,
          items: m.items,
          repeatPattern: m.repeatPattern,
        })),
      })),
    });
  };

    // Days left to add
    const daysLeft = WEEK_DAYS.filter(
      (d) => !meals.some((day: any) => day.day === d)
    );
    const [selectedDay, setSelectedDay] = useState("");
    
  return (
    <Modal onClose={onCancel}>
      <div className="mb-2 font-semibold">
        {initial ? "Edit Menu" : "Add Menu"}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Menu Number</label>
        <select
          value={menuNo}
          onChange={(e) => setMenuNo(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        >
          {availableMenuNumbers.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm">
          Week Start Date:
          <input
            type="date"
            className="ml-2 border rounded px-2 py-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold">Days</span>
            {daysLeft.length > 0 && (
              <select
                className="border rounded px-2 py-1 text-xs"
                value={selectedDay}
                onChange={(e) => {
                  const day = e.target.value;
                  if (day) {
                    setMeals([...meals, { day, meals: [] }]);
                    setSelectedDay("");
                  }
                }}
              >
                <option value="">+ Add Day</option>
                {daysLeft.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>
          {meals.map((day, dayIdx) => (
            <div key={day.day} className="border rounded p-2 mb-2 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="capitalize font-semibold">{day.day}</span>
                <button
                  className="text-xs text-red-500"
                  onClick={() => handleRemoveDay(dayIdx)}
                  type="button"
                >
                  Remove Day
                </button>
              </div>
              <div className="ml-2 mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">Meals</span>
                  {day.meals.length < MEAL_TYPES.length && (
                    <button
                      className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs"
                      onClick={() => handleAddMeal(dayIdx)}
                      type="button"
                    >
                      + Add Meal
                    </button>
                  )}
                </div>
                {day.meals.map((meal: any, mealIdx: number) => (
                  <div
                    key={mealIdx}
                    className="border rounded p-2 mb-2 bg-white"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={meal.meal}
                        onChange={(e) =>
                          handleMealChange(
                            dayIdx,
                            mealIdx,
                            "meal",
                            e.target.value
                          )
                        }
                      >
                        {MEAL_TYPES.filter(
                          (m) =>
                            !day.meals.some(
                              (other: any, idx: number) =>
                                other.meal === m && idx !== mealIdx
                            )
                        ).map((m) => (
                          <option key={m} value={m}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                          </option>
                        ))}
                      </select>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={meal.repeatPattern}
                        onChange={(e) =>
                          handleMealChange(
                            dayIdx,
                            mealIdx,
                            "repeatPattern",
                            e.target.value
                          )
                        }
                      >
                        {REPEAT_PATTERNS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="text-xs text-red-500"
                        onClick={() => handleRemoveMeal(dayIdx, mealIdx)}
                        type="button"
                      >
                        Remove Meal
                      </button>
                    </div>
                    <div className="ml-2">
                      <span className="text-xs font-semibold">Items:</span>
                      {meal.items.map((item: string, itemIdx: number) => (
                        <div
                          key={itemIdx}
                          className="flex items-center gap-1 mt-1"
                        >
                          <input
                            className="border rounded px-2 py-1 text-xs"
                            value={item}
                            onChange={(e) =>
                              handleItemChange(
                                dayIdx,
                                mealIdx,
                                itemIdx,
                                e.target.value
                              )
                            }
                            placeholder="Item name"
                          />
                          <button
                            className="text-xs text-red-400"
                            onClick={() =>
                              handleRemoveItem(dayIdx, mealIdx, itemIdx)
                            }
                            type="button"
                            disabled={meal.items.length === 1}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs mt-1"
                        onClick={() => handleAddItem(dayIdx, mealIdx)}
                        type="button"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {error && <div className="text-xs text-red-600">{error}</div>}
        <div className="flex gap-2 mt-2">
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded"
            onClick={handleSave}
            type="button"
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMealsForm;
