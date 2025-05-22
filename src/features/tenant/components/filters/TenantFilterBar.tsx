import React from "react";

const TENANT_FILTERS = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "paid", label: "Rent Paid" },
  { key: "unpaid", label: "Rent Unpaid" },
  { key: "past", label: "Past Tenants" },
];

const TenantFilterBar = ({
  filter,
  setFilter,
  filterOptions,
}: {
  filter: string;
  setFilter: (f: string) => void;
  filterOptions?: { key: string; label: string }[];
}) => (
  <div
    className="sticky z-20 flex overflow-x-auto text-sm -mt-1 pb-1 bg-purple-300 border-gray-200"
    style={{ top: 140 }}
  >
    {(filterOptions || TENANT_FILTERS).map((opt) => (
      <button
        key={opt.key}
        onClick={() => setFilter(opt.key)}
        className={`px-3 py-2 whitespace-nowrap font-semibold transition focus:outline-none
          ${
            filter === opt.key
              ? "bg-transparent text-black rounded-t-md rounded-b-none border-none"
              : "bg-transparent text-indigo-700 hover:text-purple-700 border-none"
          }`}
      > 
        {opt.label}
      </button>
    ))}
  </div>
);

export default TenantFilterBar;
