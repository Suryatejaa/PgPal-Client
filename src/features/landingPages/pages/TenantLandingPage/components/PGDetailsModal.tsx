import {
  XMarkIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CheckCircleIcon,
  EyeIcon,
  CurrencyRupeeIcon,
  CreditCardIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";

interface PGDetailsModalProps {
  pg: any;
  isOpen: boolean;
  onClose: () => void;
}

const PGDetailsModal = ({ pg, isOpen, onClose }: PGDetailsModalProps) => {
  if (!isOpen || !pg) return null;

  const handleContactOwner = () => {
    if (pg.contact?.phone) {
      window.open(`tel:${pg.contact.phone}`, "_self");
    }
  };

  const handleWhatsAppContact = () => {
    if (pg.contact?.phone) {
      const message = `Hi, I'm interested in ${pg.name || "your PG"} (ID: ${
        pg.pgpalId
      }). Can you provide more details?`;
      window.open(
        `https://wa.me/91${pg.contact.phone}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {pg.name || "PG Details"}
            </h2>
            <p className="text-purple-600 font-semibold">ID: {pg.pgpalId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Image Placeholder */}
          <div className="h-64 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-8xl mb-6">
            🏠
          </div>

          {/* Property Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Property Details
              </h3>

              <div className="flex items-center gap-3">
                <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Gender Type</p>
                  <p className="text-gray-600 capitalize">{pg.pgGenderType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <HomeIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Accommodation</p>
                  <p className="text-gray-600">
                    {pg.totalBeds} beds in {pg.totalRooms} rooms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Availability</p>
                  <p className="text-gray-600">
                    {pg.availableBeds} beds available
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <EyeIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Views</p>
                  <p className="text-gray-600">{pg.views} people viewed this</p>
                </div>
              </div>
            </div>

            {/* Pricing & Contact */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pricing & Contact
              </h3>

              <div className="flex items-center gap-3">
                <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Rent Range</p>
                  <p className="text-gray-600">
                    ₹{pg.rentRange?.min} - ₹{pg.rentRange?.max} per month
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Security Deposit
                  </p>
                  <p className="text-gray-600">
                    ₹{pg.depositRange?.min} - ₹{pg.depositRange?.max}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Contact</p>
                  <p className="text-gray-600">
                    {pg.contact?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Listed</p>
                  <p className="text-gray-600">
                    {new Date(pg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Address</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {pg.address?.line1}
                  </p>
                  {pg.address?.line2 && (
                    <p className="text-gray-600">{pg.address.line2}</p>
                  )}
                  <p className="text-gray-600">
                    {pg.address?.street && `${pg.address.street}, `}
                    {pg.address?.area && `${pg.address.area}, `}
                    {pg.address?.city}
                  </p>
                  {pg.address?.plotNumber && (
                    <p className="text-sm text-gray-500">
                      Plot: {pg.address.plotNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
            {pg.amenities && pg.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pg.amenities.map((amenity: string, index: number) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleContactOwner}
              disabled={!pg.contact?.phone}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PhoneIcon className="w-5 h-5" />
              Call Owner
            </button>
            <button
              onClick={handleWhatsAppContact}
              disabled={!pg.contact?.phone}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGDetailsModal;
