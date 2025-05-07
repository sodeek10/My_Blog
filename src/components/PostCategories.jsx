// src/components/PostCategories.jsx
// import { useState } from "react";
import { Badge } from "./ui/badge";

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
        <Badge
          key={category}
          variant={selected.includes(category) ? "default" : "outline"}
          onClick={() => onChange(category)}
          className="cursor-pointer"
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}

export function PostCategoriesDisplay({ categories }) {
  return (
    <div className="flex gap-2 mt-4">
      {categories?.map((category) => (
        <Badge key={category} variant="secondary">
          {category}
        </Badge>
      ))}
    </div>
  );
}
