import { FaEdit, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import GlobalAlert from "../../../../components/GlobalAlert";

const ReviewsSection = ({
  propertyId,
  userId,
  userName,
  userRole,
  isOwner,
}: {
  propertyId: string;
  userId: string;
  userName: string;
  userRole: string;
  isOwner: boolean;
}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [average, setAverage] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(
        `/property-service/${propertyId}/reviews`
      );
      setReviews(res.data.reviews);
      setAverage(res.data.averageRating);
    } catch (err: any) {
      console.log(err.response.data.error);
      const expected = "No reviews found for this property";
      if (err?.response?.data?.error !== expected) {
        setAlert({
          message:
            err?.response?.data?.error ||
            err?.message ||
            "Failed to fetch reviews.",
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await axiosInstance.put(
          `/property-service/${propertyId}/reviews/${editing}`,
          { rating, comment }
        );
        setAlert({ message: "Review updated!", type: "success" });
      } else {
        await axiosInstance.post(`/property-service/${propertyId}/reviews`, {
          rating,
          comment,
        });
        setAlert({ message: "Review added!", type: "success" });
      }
      setComment("");
      setRating(3);
      setEditing(null);
      fetchReviews();
    } catch {
      setAlert({ message: "Failed to submit review", type: "error" });
    }
  };

  const handleDelete = async (reviewId: string, updatedBy: string) => {
    if (!isOwner && updatedBy !== userId) return;
    try {
      await axiosInstance.delete(
        `/property-service/${propertyId}/reviews/${reviewId}`
      );
      setAlert({ message: "Review deleted!", type: "success" });
      fetchReviews();
    } catch {
      setAlert({ message: "Failed to delete review", type: "error" });
    }
  };

  const startEdit = (review: any) => {
    setEditing(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4 text-black">
      {alert && <GlobalAlert {...alert} onClose={() => setAlert(null)} />}
      <div className="font-bold text-purple-700 mb-2">Reviews</div>
      {average !== null && (
        <div className="mb-2 text-sm text-indigo-700">
          Average Rating: <span className="font-bold">{average ? average.toFixed(1) : 0}</span> / 5
        </div>
      )}
      <form onSubmit={handleAddOrEdit} className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2">
          <label className="text-sm">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a review..."
          className="border rounded px-2 py-1"
          rows={2}
          required
        />
        <div className="flex gap-2">
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded"
            type="submit"
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
              onClick={() => {
                setEditing(null);
                setComment("");
                setRating(3);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-2">
        {sortedReviews.map((r) => (
          <li key={r._id} className="bg-purple-50 rounded px-2 py-1">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{r.updatedByName}</span>
                <span className="ml-2 text-yellow-600">★ {r.rating}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(r.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-1">
                {/* Only the user who wrote the review can edit */}
                {r.updatedBy === userId && (
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => startEdit(r)}
                  >
                    <FaEdit size={16} />
                  </button>
                )}
                {/* Owner or the user who wrote the review can delete */}
                {(isOwner || r.updatedBy === userId) && (
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => handleDelete(r._id, r.updatedBy)}
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="ml-2">{r.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsSection;
