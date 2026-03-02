import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => { navigate(`/room/${room._id}`); scrollTo(0, 0); }}
      className="relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.hotel.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
        />
        {index % 2 === 0 && (
          <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full shadow">
            Best Seller
          </p>
        )}
        {room.discount > 0 && (
          <p className="px-3 py-1 absolute top-3 right-3 text-xs bg-orange-500 text-white font-medium rounded-full">
            {room.discount}% OFF
          </p>
        )}
      </div>

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl font-medium text-gray-800">
            {room.hotel.name}
          </p>
          <div className="flex items-center gap-1">
            <img src={assets.starIconFilled} alt="star-icon" />
            <span className="text-sm">4.5</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm mt-1">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.city}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p>
            <span className="text-xl text-gray-800 font-medium">
              ${room.pricePerNight}
            </span>
            <span className="text-sm">/night</span>
          </p>
          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
export default HotelCard;
