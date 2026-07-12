import { Star } from "lucide-react";

export default function StarRating({
  rating,
  count,
}: {
  rating: number;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= Math.round(rating)
              ? "fill-orange-400 text-orange-400"
              : "text-gray-600"
          }
        />
      ))}
      <span className="text-xs text-[#8D93A5]">{rating}</span>
      {count !== undefined && (
        <span className="text-xs text-[#8D93A5]">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
