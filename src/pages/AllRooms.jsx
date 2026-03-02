import React, { useState, useMemo, useEffect } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
    <span className="font-light select-none">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="radio" name="sortOption" checked={selected} onChange={() => onChange(label)} />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllRooms = () => {
  const navigate = useNavigate();
  const { rooms, searchQuery, setSearchQuery } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortOption, setSortOption] = useState("");
  // Local search input — synced with context searchQuery
  const [localSearch, setLocalSearch] = useState(searchQuery.destination || "");

  // Sync local search when context changes (e.g. coming from Hero)
  useEffect(() => {
    setLocalSearch(searchQuery.destination || "");
  }, [searchQuery.destination]);

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes((prev) => checked ? [...prev, label] : prev.filter((t) => t !== label));
  };

  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges((prev) => checked ? [...prev, label] : prev.filter((r) => r !== label));
  };

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSortOption("");
    setLocalSearch("");
    setSearchQuery({ destination: "", checkIn: "", checkOut: "", guests: 1 });
  };

  // Active search term — either from local input or context
  const activeSearch = localSearch.trim().toLowerCase();

  const filteredRooms = useMemo(() => {
    let result = rooms.filter((r) => r.isAvailable !== false);

    // City / hotel name search
    if (activeSearch) {
      result = result.filter(
        (r) =>
          r.hotel?.city?.toLowerCase().includes(activeSearch) ||
          r.hotel?.name?.toLowerCase().includes(activeSearch) ||
          r.hotel?.address?.toLowerCase().includes(activeSearch) ||
          r.roomType?.toLowerCase().includes(activeSearch)
      );
    }

    // Room type filter
    if (selectedRoomTypes.length > 0) {
      result = result.filter((r) => selectedRoomTypes.includes(r.roomType));
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter((r) => {
        return selectedPriceRanges.some((range) => {
          const [min, max] = range.replace(/\$/g, "").split(" to ").map(Number);
          return r.pricePerNight >= min && r.pricePerNight <= max;
        });
      });
    }

    // Sort
    if (sortOption === "Price Low to High") {
      result = [...result].sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOption === "Price High to Low") {
      result = [...result].sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortOption === "Newest First") {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [rooms, activeSearch, selectedRoomTypes, selectedPriceRanges, sortOption]);

  const hasActiveFilters = activeSearch || selectedRoomTypes.length > 0 || selectedPriceRanges.length > 0 || sortOption;

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">

      <div className="w-full lg:flex-1">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories
          </p>

          {/* Search bar on rooms page */}
          <div className="flex items-center gap-2 mt-4 w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm">
            <img src={assets.searchIcon} alt="" className="h-4 opacity-50" />
            <input
              type="text"
              placeholder="Search by city, hotel name..."
              className="flex-1 text-sm outline-none text-gray-700"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button onClick={() => setLocalSearch("")} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            )}
          </div>

          {/* Active search indicator */}
          {activeSearch && (
            <p className="mt-2 text-sm text-blue-600">
              Showing results for: <strong>"{activeSearch}"</strong>
              <button onClick={clearFilters} className="ml-2 text-gray-400 hover:text-gray-600 underline text-xs">clear</button>
            </p>
          )}
        </div>

        {filteredRooms.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-xl">No rooms found matching your criteria.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 text-sm underline text-blue-500">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            >
              <img
                onClick={() => { navigate(`/room/${room._id}`); scrollTo(0, 0); }}
                src={room.images[0]}
                alt="hotel-img"
                title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel?.city}</p>
                <p
                  onClick={() => { navigate(`/room/${room._id}`); scrollTo(0, 0); }}
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel?.name}
                </p>
                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{room.hotel?.address}</span>
                </div>
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {room.amenities.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70">
                      <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-medium text-gray-700">${room.pricePerNight}/night</p>
                  {room.discount > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{room.discount}% OFF</span>
                  )}
                </div>
                <button
                  onClick={() => { navigate(`/room/${room._id}`); scrollTo(0, 0); }}
                  className="mt-2 w-fit bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-primary-dull transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters sidebar */}
      <div className="bg-white w-full lg:w-72 border border-gray-300 rounded-lg text-gray-600 mb-8 lg:mb-0 lg:ml-8 lg:mt-16 lg:sticky lg:top-28">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-300">
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="flex gap-3 text-xs">
            <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden cursor-pointer">
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              onClick={clearFilters}
              className={`cursor-pointer hidden lg:block ${hasActiveFilters ? "text-blue-500 hover:underline" : "text-gray-300"}`}
            >
              CLEAR
            </span>
          </div>
        </div>
        <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Room Type</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`$ ${range}`}
                selected={selectedPriceRanges.includes(`$ ${range}`)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={sortOption === option}
                onChange={setSortOption}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
