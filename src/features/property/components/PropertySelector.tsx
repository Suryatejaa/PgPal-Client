import React from "react";

interface PropertySelectorProps {
  properties: any[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({
  properties,
  selectedId,
  onSelect,
}) => (
  <select
    className="mb-4 p-2 rounded border"
    value={selectedId}
    onChange={(e) => onSelect(e.target.value)}
  >
    {properties.map((p) => (
      <option key={p._id} value={p._id}>
        {p.name}
      </option>
    ))}
  </select>
);

export default PropertySelector;
