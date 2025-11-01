
import { useState } from "react"

export default function ListingCard({ listing }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="cursor-pointer transition duration-200 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="rounded-lg overflow-hidden bg-gray-200 mb-3 h-56 relative">
        <img src={listing.image || "/placeholder.svg"} alt={listing.name} className="w-full h-full object-cover" />
        {isHovered && <div className="absolute inset-0 bg-black bg-opacity-10 transition duration-200" />}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 text-base">{listing.name}</h3>

        <p className="text-gray-600 text-sm">{listing.price}</p>

        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-gray-700 font-semibold text-sm">{listing.rating}</span>
          <span className="text-gray-500 text-sm">({listing.reviews})</span>
        </div>
      </div>
    </div>
  )
}
