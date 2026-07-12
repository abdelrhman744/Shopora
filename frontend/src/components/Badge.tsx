const COLORS: Record<string, string> = {
  "Best Seller": "from-orange-500 to-pink-600",
  New: "from-purple-600 to-violet-700",
  Sale: "from-pink-500 to-rose-600",
  Hot: "from-red-500 to-orange-600",
  Popular: "from-purple-500 to-pink-600",
  "Top Pick": "from-violet-600 to-purple-700",
  Deal: "from-orange-400 to-pink-500",
  Trending: "from-pink-600 to-purple-600",
};

export default function Badge({ label }: { label: string }) {
  if (!label) return null;
  return (
    <span
      className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-gradient-to-r ${
        COLORS[label] || "from-gray-600 to-gray-700"
      }`}
    >
      {label}
    </span>
  );
}
