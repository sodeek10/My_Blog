// src/components/PostCategories.jsx
const categories = [
  "Technology",
  "Design",
  "Business",
  "Lifestyle",
  "Programming",
];

export function PostCategorySelector({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
            selected.includes(category)
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export function PostCategoriesDisplay({ categories }) {
  return (
    <div className="flex gap-2 mt-4">
      {categories?.map((category) => (
        <span
          key={category}
          className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
        >
          {category}
        </span>
      ))}
    </div>
  );
}
