// src/components/LoadingSkeleton.jsx
export default function LoadingSkeleton({ count = 1 }) {
  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
