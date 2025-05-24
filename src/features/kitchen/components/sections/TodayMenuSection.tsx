import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";

interface TodayMenuSectionProps {
  pgpalId: string;
}

const TodayMenuSection: React.FC<TodayMenuSectionProps> = ({ pgpalId }) => {
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pgpalId) {
      setLoading(true);
      axiosInstance
        .get(`/kitchen-service/${pgpalId}/menu-today`)
        .then((res) => setMenu(res.data))
        .catch(() => setMenu(null))
        .finally(() => setLoading(false));
    }
  }, [pgpalId]);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  if (!menu || !menu.meals || menu.meals.length === 0) {
    return <div className="text-gray-500">Today menu not available.</div>;
  }

  return (
    <div>
      <div className="font-bold text-lg mb-2 capitalize">{menu.day} Menu</div>
      {menu.meals.map((meal: any, idx: number) => (
        <div key={idx} className="mb-4">
          {meal.meals.map((m: any, i: number) => (
            <div key={i} className="mb-2">
              {Object.entries(m).map(([mealType, items]) =>
                mealType !== "repeat" ? (
                  <div key={mealType}>
                    <span className="font-semibold text-purple-700">
                      {mealType}:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {(items as string[]).join(", ")}
                    </span>
                  </div>
                ) : null
              )}
              {m.repeat && (
                <div className="text-xs text-gray-500 ml-2">
                  <span className="italic">({m.repeat})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TodayMenuSection;
