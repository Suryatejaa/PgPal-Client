import PropertyOverview from "../../../dashboard/components/PropertyOverview";
import PropertyStats from "../../../dashboard/components/StatsComponent";
import AmenitiesSection from "../../../dashboard/components/AmenitiesSection";
import RulesSection from "../../../dashboard/components/RulesSection";
import ReviewsSection from "../../../dashboard/components/ReviewsSection";

const OverviewSection = ({
  property,
  userId,
  userName,
  userRole,
  isOwner,
}: {
  property: any;
  userId: string;
  userName: string;
  userRole: string;
  isOwner: boolean;
}) => (
  <>
    <PropertyOverview pgpalId={property.pgpalId} />
    <PropertyStats pgpalId={property.pgpalId} />
    <div className="bg-white rounded-xl shadow p-4 text-gray-800">
      <div>
        <strong>Contact:</strong> {property.contact?.phone} |{" "}
        {property.contact?.email}
      </div>
    </div>
    <AmenitiesSection propertyId={property._id} />
    <RulesSection propertyId={property._id} isOwner={isOwner} userId={userId} />
    <ReviewsSection
      propertyId={property._id}
      userId={userId}
      userName={userName}
      userRole={userRole}
      isOwner={isOwner}
    />
  </>
);

export default OverviewSection;