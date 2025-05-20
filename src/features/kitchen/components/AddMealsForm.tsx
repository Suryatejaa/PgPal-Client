import React, { useState } from "react";

const defaultMealEntry = {
  day: "",
  meals: [
    {
      meal: "",
      items: [""],
      repeatPattern: "none",
    },
  ],
};

const AddMealForm = ({ propertyPpid, onSubmit, onCancel }) => {
  const [date, setDate] = useState("");
  const [meals, setMeals] = useState([{ ...defaultMealEntry }]);

  const handleMealChange = (dayIndex, mealIndex, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[dayIndex].meals[mealIndex][field] = value;
    setMeals(updatedMeals);
  };

  const handleItemChange = (dayIndex, mealIndex, itemIndex, value) => {
    const updatedMeals = [...meals];
    updatedMeals[dayIndex].meals[mealIndex].items[itemIndex] = value;
    setMeals(updatedMeals);
  };

  const addItem = (dayIndex, mealIndex) => {
    const updatedMeals = [...meals];
    updatedMeals[dayIndex].meals[mealIndex].items.push("");
    setMeals(updatedMeals);
  };

  const addMeal = (dayIndex) => {
    const updatedMeals = [...meals];
    updatedMeals[dayIndex].meals.push({
      meal: "",
      items: [""],
      repeatPattern: "none",
    });
    setMeals(updatedMeals);
  };

  const addDay = () => {
    setMeals([...meals, { ...defaultMealEntry }]);
  };

  const handleDayChange = (index, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index].day = value;
    setMeals(updatedMeals);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatted = {
      propertyPpid,
      date,
      meals,
    };
    onSubmit(formatted);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      {meals.map((dayEntry, dayIndex) => (
        <div key={dayIndex} className="border p-2 rounded space-y-2">
          <input
            type="text"
            placeholder="Day (e.g., Monday)"
            value={dayEntry.day}
            onChange={(e) => handleDayChange(dayIndex, e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {dayEntry.meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="space-y-1">
              <input
                type="text"
                placeholder="Meal (e.g., Breakfast)"
                value={meal.meal}
                onChange={(e) =>
                  handleMealChange(dayIndex, mealIndex, "meal", e.target.value)
                }
                className="w-full p-2 border rounded"
                required
              />
              {meal.items.map((item, itemIndex) => (
                <input
                  key={itemIndex}
                  type="text"
                  placeholder={`Item ${itemIndex + 1}`}
                  value={item}
                  onChange={(e) =>
                    handleItemChange(
                      dayIndex,
                      mealIndex,
                      itemIndex,
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              ))}
              <button
                type="button"
                onClick={() => addItem(dayIndex, mealIndex)}
                className="text-blue-600"
              >
                + Add Item
              </button>
              <select
                value={meal.repeatPattern}
                onChange={(e) =>
                  handleMealChange(
                    dayIndex,
                    mealIndex,
                    "repeatPattern",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded"
              >
                <option value="none">None</option>
                <option value="weekly">Weekly</option>
                <option value="alternateWeeks">Alternate Weeks</option>
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addMeal(dayIndex)}
            className="text-purple-600"
          >
            + Add Meal
          </button>
        </div>
      ))}

      <button type="button" onClick={addDay} className="text-green-600">
        + Add Day
      </button>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddMealForm;
