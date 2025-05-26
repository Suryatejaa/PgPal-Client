import React, { useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";

function AddReviewForm({
  propertyId,
  onReviewAdded,
}: {
  propertyId: string;
  onReviewAdded: (r: any) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError("Please provide a rating and comment.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await axiosInstance.post(
        `/property-service/${propertyId}/reviews`,
        {
          rating,
          comment,
        }
      );
      onReviewAdded();
      setRating(0);
      setComment("");
    } catch (err: any) {
      setError("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t pt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold">Your Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-3xl px-0 py-0 bg-transparent text-yellow-400 focus:outline-none border-none hover:text-yellow-500 transition"
            style={{ minWidth: 32 }}
            onClick={() => setRating(star)}
          >
            {star <= rating ? "★" : "☆"}
          </button>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={2}
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={submitting}
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
export default AddReviewForm;
