import React from "react";

const TenantListByFloor = ({
  tenantsByFloor,
  onRemove,
}: {
  tenantsByFloor: Record<string, any[]>;
  onRemove: (tenantId: string) => void;
}) => (
  console.log(tenantsByFloor),
  (
    <>
      {Object.keys(tenantsByFloor)
        .sort((a, b) => Number(a) - Number(b))
        .map((floor) => (
          <div key={floor}>
            <div className="font-bold text-lg mb-1 text-purple-700">
              Floor: {floor}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[...tenantsByFloor[floor]]
                .sort((a, b) =>
                  (a.currentStay?.bedId || "").localeCompare(
                    b.currentStay?.bedId || "",
                    undefined,
                    { numeric: true }
                  )
                )
                .map((tenant) => (
                  <div
                    key={tenant.pgpalId}
                    className="bg-white rounded-lg shadow p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg text-purple-800">
                          {tenant.name}
                        </div>
                        <div className="font-bold text-xs text-purple-800">
                          {tenant.pgpalId}
                        </div>
                        <div className="text-gray-700">
                          Stay: {tenant.currentStay.bedId}
                        </div>
                        <div className="text-gray-700">
                          Phone: {tenant.phone}
                        </div>
                        <div className="text-gray-700">
                          Status: {tenant.status}
                        </div>
                        <div className="text-gray-700">
                          Rent: ₹{tenant.currentStay?.rent ?? "-"}
                        </div>
                        <div className="text-gray-700">
                          Rent Paid: ₹{tenant.currentStay?.rentPaid ?? "-"}
                        </div>
                        <div className="text-gray-700">
                          Rent Due: ₹{tenant.currentStay?.rentDue ?? "-"}
                        </div>
                        <div className="text-gray-700">
                          Rent Status:{" "}
                          {tenant.currentStay?.rentPaidStatus ?? "-"}
                        </div>
                        {tenant.currentStay.deposit && (
                          <div className="text-gray-700">
                            Deposit: ₹{tenant.currentStay.deposit}
                          </div>
                        )}
                        {Number(tenant.currentStay.nextRentDue) > 0 && (
                          <div className="text-gray-700">
                            Advance Balance: ₹
                            {tenant.currentStay.rentPaid -
                              tenant.currentStay.rent}
                          </div>
                        )}
                        {Number(tenant.currentStay.nextRentDue) > 0 && (
                          <div className="text-gray-700">
                            Next rent Due: ₹{tenant.currentStay.nextRentDue}
                          </div>
                        )}
                      </div>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => onRemove(tenant.pgpalId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </>
  )
);

export default TenantListByFloor;
