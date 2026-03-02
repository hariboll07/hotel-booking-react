import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const { userBookings, markAsPaid } = useAppContext();

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subtitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />
      <div className="max-w-6xl mt-8 w-full text-gray-800">
        {userBookings.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-xl">No bookings yet.</p>
            <Link to="/rooms" className="mt-4 inline-block text-sm text-blue-500 underline">
              Browse rooms
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
              <div>Hotels</div>
              <div>Date &amp; Timings</div>
              <div>Payment</div>
            </div>
            {userBookings.map((booking) => (
              <div
                key={booking._id}
                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
              >
                {/* Hotel Details */}
                <div className="flex flex-col md:flex-row">
                  <img
                    src={booking.room.images[0]}
                    alt="hotel-img"
                    className="min-md:w-44 rounded shadow object-cover max-h-32 md:max-h-none"
                  />
                  <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                    <p className="font-playfair text-2xl">
                      {booking.hotel.name}
                      <span className="font-inter text-xs bg-green-300 rounded-full py-0.5 px-1.5 ml-2">
                        {booking.room.roomType}
                      </span>
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.locationIcon} alt="location-icon" />
                      <span>{booking.hotel.address}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.guestsIcon} alt="guests-icon" />
                      <span>Guests: {booking.guests}</span>
                    </div>
                    <p className="text-base">Total: ${booking.totalPrice}</p>
                  </div>
                </div>

                {/* Date & Timings */}
                <div className="flex flex-row md:flex-col md:justify-center gap-8 md:gap-3 mt-3 md:mt-0">
                  <div>
                    <p className="font-medium">Check-In:</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(booking.checkInDate).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Check-Out:</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(booking.checkOutDate).toDateString()}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex flex-col items-start justify-center pt-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                      {booking.isPaid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                  {!booking.isPaid && (
                    <button
                      onClick={() => markAsPaid(booking._id)}
                      className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Pay Now
                    </button>
                  )}
                  {booking.isPaid && (
                    <p className="text-xs text-gray-400 mt-1">{booking.paymentMethod}</p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
