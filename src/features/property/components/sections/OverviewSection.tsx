import PropertyOverview from "../../../dashboard/components/PropertyOverview";
import PropertyStats from "../../../dashboard/components/StatsComponent";

const OverviewSection = ({ property }: { property: any }) => (
  <>
    <PropertyOverview pgpalId={property.pgpalId} />
    <PropertyStats pgpalId={property.pgpalId} />
    <div className="bg-white rounded-xl shadow p-4 text-gray-800">
      <div>
        <strong>Contact:</strong> {property.contact?.phone} |{" "}
        {property.contact?.email}
      </div>     
    </div>
  </>
);

export default OverviewSection;
