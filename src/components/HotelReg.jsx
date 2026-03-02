import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const HotelReg = ({ onClose }) => {
  const { setHotel, currentUser } = useAppContext();
  const [form, setForm] = useState({ name: "", contact: "", address: "", city: "" });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newHotel = {
      _id: `hotel_${Date.now()}`,
      name: form.name,
      address: form.address,
      contact: form.contact,
      city: form.city,
      owner: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    setHotel(newHotel);
    localStorage.setItem("app_hotel", JSON.stringify(newHotel));
    setSuccess(true);
    setTimeout(() => onClose && onClose(), 1200);
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70">
      <form
        onSubmit={handleSubmit}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      >
        <img
          src={assets.regImage}
          alt="reg-image"
          className="w-1/2 rounded-xl hidden md:block object-cover"
        />

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={onClose}
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {success ? (
            <p className="text-green-600 mt-8 text-center">
              ✅ Hotel registered successfully!
            </p>
          ) : (
            <>
              <div className="w-full mt-4">
                <label htmlFor="name" className="font-medium text-gray-500">Hotel Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Type here"
                  className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="w-full mt-4">
                <label htmlFor="contact" className="font-medium text-gray-500">Phone</label>
                <input
                  id="contact"
                  type="text"
                  placeholder="Type here"
                  className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                  required
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </div>
              <div className="w-full mt-4">
                <label htmlFor="address" className="font-medium text-gray-500">Address</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Type here"
                  className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="w-full mt-4 max-w-60 mr-auto">
                <label htmlFor="city" className="font-medium text-gray-500">City</label>
                <select
                  id="city"
                  className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6"
              >
                Register
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
