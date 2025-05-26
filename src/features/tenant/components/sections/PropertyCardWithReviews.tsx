import React from "react";
import PropertyCard from "../../../property/components/PropertyCard";
import PropertyReviews from "./PropertyReviews";

// You can place this inside TenantLandingPage.tsx or in a separate file
const PropertyCardWithReviews = ({
  property,
  openReviewsPropertyId,
  setOpenReviewsPropertyId,
  handleClickPropertyCard,
}: {
  property: any;
  openReviewsPropertyId: string | null;
  setOpenReviewsPropertyId: (id: string | null) => void;
  handleClickPropertyCard: (property: any) => void;
}) => (
  <React.Fragment key={property._id}>
    <div className="w-full sm:w-auto relative">
      <PropertyCard
        property={property}
        fromTenantLandingPage={true}
        onClick={() => handleClickPropertyCard(property)}
      />
      <button
        className="absolute bottom-1 right-1 bg-transparent text-purple-700 underline text-sm focus:outline-none border-none"
        onClick={(e) => {
          e.stopPropagation();
          setOpenReviewsPropertyId(
            openReviewsPropertyId === property._id ? null : property._id
          );
        }}
      >
        {openReviewsPropertyId === property._id
          ? "Hide Reviews"
          : "Show Reviews"}
      </button>
    </div>
    {openReviewsPropertyId === property._id && (
      <div className="w-full mb-4 -mt-1">
        <PropertyReviews propertyId={property._id} />
      </div>
    )}
  </React.Fragment>
);

export default PropertyCardWithReviews;