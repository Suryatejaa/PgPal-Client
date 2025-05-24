import React from "react";

const StickySectionBar = ({
  sectionList,
  selectedSection,
  setSelectedSection,
  isSticky,
}: {
  sectionList: { key: string; label: string }[];
  selectedSection: string;
  setSelectedSection: (key: string) => void;
  isSticky: boolean;
}) => (
  <div
    className={`sticky z-10 bg-white w-full transition-colors duration-500 ${
      isSticky ? "from-purple-600 to-indigo-600 rounded-t-none border-none" : ""
    }`}
    style={{ top: "60px" }}
  >
    <div className="flex space-x-1 overflow-x-auto -mb-3 -ml-2 border-none">
      {sectionList.map((section) => (
        <button
          key={section.key}
          onClick={() => setSelectedSection(section.key)}
          className={`px-4 py-2 whitespace-nowrap mt-0 ms-2 font-semibold transition focus:outline-none bg-transparent border-none focus:outline-none focus:border-none 
            ${
              selectedSection === section.key
                ? "!bg-purple-200 text-black rounded-t-md rounded-b-none border-b-0 border-purple-700 focus:outline-none focus:border-none "
                : "text-purple-900 hover:text-purple-700 rounded-t-md"
            }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  </div>
);

export default StickySectionBar;
