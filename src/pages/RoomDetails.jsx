import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import { useClerk } from "@clerk/clerk-react";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, createBooking, searchQuery } = useAppContext();
  const { openSignIn } = useClerk();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(searchQuery.checkIn || "");
  const [checkOutDate, setCheckOutDate] = useState(searchQuery.checkOut || "");
  const [guests, setGuests] = useState(searchQuery.guests || 1);
  const [showContact, setShowContact] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const found = rooms.find((r) => r._id === id);
    if (found) {
      setRoom(found);
      setMainImage(found.images[0]);
    }
  }, [id, rooms]);

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingError("");

    if (!checkInDate || !checkOutDate) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setBookingError("Check-out date must be after check-in date.");
      return;
    }

    const booking = createBooking({ roomId: id, checkInDate, checkOutDate, guests });
    if (booking?.error === "auth_required") {
      openSignIn();
      return;
    }
    if (booking) {
      setBookingSuccess(true);
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    }
  };

  const nights =
    checkInDate && checkOutDate
      ? Math.max(
          1,
          Math.round(
            (new Date(checkOutDate) - new Date(checkInDate)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

  const estimatedPrice =
    nights && room
      ? Math.round(room.pricePerNight * nights * (1 - (room.discount || 0) / 100))
      : null;

  if (!room) return null;

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel.name}{" "}
          <span className="font-inter text-sm bg-green-300 rounded-full py-0.1 px-1">
            {room.roomType}
          </span>
        </h1>
        {room.discount > 0 && (
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            {room.discount}% OFF
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>

      <div className="flex item-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.hotel.address}</span>
      </div>

      {/* Room Images */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage}
            alt="Room Image"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room.images.length > 1 &&
            room.images.map((image, index) => (
              <img
                onClick={() => setMainImage(image)}
                src={image}
                key={index}
                alt="Room-Image"
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                  mainImage === image
                    ? "outline-3 outline-orange-500"
                    : "transform transition-transform duration-400 hover:scale-106"
                }`}
              />
            ))}
        </div>
      </div>

      {/* Room Highlights */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <img src={facilityIcons[item]} alt={item} className="h-5 w-5" />
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
          {room.discount > 0 && (
            <p className="text-sm text-orange-500">{room.discount}% discount applied</p>
          )}
        </div>
      </div>

      {/* Booking Form */}
      {bookingSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 mt-16 max-w-6xl mx-auto text-center">
          <p className="text-2xl text-green-700 font-semibold">🎉 Booking Confirmed!</p>
          <p className="text-gray-500 mt-2">Redirecting to My Bookings...</p>
        </div>
      ) : (
        <form
          onSubmit={handleBooking}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium text-gray-700">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium text-gray-700">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                min={checkInDate || new Date().toISOString().split("T")[0]}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium text-gray-700">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                min={1}
                max={10}
                placeholder="1"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
            {estimatedPrice && (
              <div className="flex flex-col">
                <p className="font-medium text-gray-700">Estimated Total</p>
                <p className="text-lg font-bold text-primary mt-1.5">
                  ${estimatedPrice}{" "}
                  <span className="text-sm font-normal text-gray-400">
                    ({nights} night{nights > 1 ? "s" : ""})
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end max-md:w-full max-md:mt-6">
            {bookingError && (
              <p className="text-red-500 text-sm mb-2">{bookingError}</p>
            )}
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full md:px-12 py-3 md:py-4 text-base cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </form>
      )}

      {/* Common Specifications */}
      <div className="mt-25 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to availability.
          You get a comfortable room that offers a true city-living experience. The
          price quoted is for the selected number of guests. Please select the
          number of guests to get the exact price for group stays. Rooms are
          assigned based on availability while ensuring a comfortable stay.
        </p>
      </div>

      {/* Hosted by */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <img
            src={room.hotel.owner.image}
            alt="Host"
            className="h-14 w-14 md:h-18 md:w-18 rounded-full"
          />
          <div>
            <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2">200+ reviews</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowContact(true)} className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
          Contact Now
        </button>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <p className="text-2xl mb-1">🏨</p>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Contact {room.hotel.name}</h2>
            <p className="text-gray-500 text-sm mb-4">Reach out to the hotel directly for special requests or inquiries.</p>
            {room.hotel.contact && (
              <p className="text-sm text-gray-700 mb-2">📞 {room.hotel.contact}</p>
            )}
            <p className="text-sm text-gray-700 mb-4">📍 {room.hotel.address}</p>
            <button
              onClick={() => setShowContact(false)}
              className="px-6 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
