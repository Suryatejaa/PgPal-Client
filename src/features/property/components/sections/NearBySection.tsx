import PropertyCard from "../PropertyCard";

const NearbyPGsSection = ({ pgs }: { pgs: any[] }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Nearby PGs</h2>
      {pgs.length === 0 ? (
        <div>No PGs found nearby.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pgs.map((pg) => (
            <PropertyCard
              key={pg._id}
              property={pg}
              onClick={() => {}}
              isSelected={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyPGsSection;
