import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Hero = () => {
  const navigate = useNavigate();
  const { setSearchQuery } = useAppContext();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery({ destination, checkIn, checkOut, guests });
    navigate("/rooms");
  };

  return (
    <div className='flex flex-col item-start justify-center px-6 md:px-8 lg:px-10 xl:px-15 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className="w-fit bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
        The Smart Way to Stay
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Manage Hotels. Simplify Bookings. Delight Guests.
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base">
        Streamline room management, reservations, and guest experiences with an
        all-in-one hotel management solution built for modern hospitality.
      </p>
      <form
        onSubmit={handleSearch}
        className="w-fit flex-wrap bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col justify-center md:flex-row max-md:items-start gap-4 max-md:mx-auto"
      >
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            list="destinations"
            id="destinationInput"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={10}
            id="guests"
            type="number"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="1"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1 hover:bg-gray-800 transition-colors"
        >
          <img src={assets.searchIcon} alt="" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};
export default Hero;
