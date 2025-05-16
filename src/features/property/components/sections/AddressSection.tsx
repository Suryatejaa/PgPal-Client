const AddressSection = ({ property }: { property: any }) => (
  <div className="bg-white rounded-xl shadow p-4 text-gray-800">
    <div>
      <strong>Plot Number:</strong> {property.address?.plotNumber}
    </div>
    <div>
      <strong>Line 1:</strong> {property.address?.line1}
    </div>
    <div>
      <strong>Line 2:</strong> {property.address?.line2}
    </div>
    <div>
      <strong>Street:</strong> {property.address?.street}
    </div>
    <div>
      <strong>City:</strong> {property.address?.city}
    </div>
    <div>
      <strong>State:</strong> {property.address?.state}
    </div>
    <div>
      <strong>Country:</strong> {property.address?.country}
    </div>
    <div>
      <strong>Zip Code:</strong> {property.address?.zipCode}
    </div>
  </div>
);

export default AddressSection;
