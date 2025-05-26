import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import AddReviewForm from "./AddReviewForm";

const PropertyReviews = ({ propertyId }: { propertyId: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/property-service/${propertyId}/reviews`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setAverageRating(res.data.averageRating ?? null);
      })
      .catch(() => {
        setReviews([]);
        setAverageRating(null);
      });
  }, [propertyId]);

  const sortedReviews = [...reviews].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow p-3">
      <h4 className="text-base font-bold flex items-center gap-2 mb-2">
        Reviews
        {typeof averageRating === "number" && (
          <span className="flex items-center text-yellow-500 text-base font-semibold ml-2">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
            </svg>
            {averageRating ? averageRating.toFixed(1) : "N/A"}
          </span>
        )}
      </h4>
      {sortedReviews.length === 0 ? (
        <div className="text-gray-400 text-sm">No reviews yet.</div>
      ) : (
        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
          {sortedReviews.map((r) => (
            <div key={r._id} className="bg-gray-50 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-purple-700">
                  {r.updatedByName}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center text-yellow-500 text-xs ml-2">
                  <svg
                    className="w-3 h-3 mr-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                  {r.rating}
                </span>
              </div>
              <div className="text-gray-700 text-sm">{r.comment}</div>
            </div>
          ))}
        </div>
      )}
      <AddReviewForm
        propertyId={propertyId}
        onReviewAdded={() => {
          // Refetch reviews
          axiosInstance
            .get(`/property-service/${propertyId}/reviews`)
            .then((res) => {
              setReviews(res.data.reviews || []);
              setAverageRating(res.data.averageRating ?? null);
            });
        }}
      />
    </div>
  );
};

export default PropertyReviews;
