import React, { useState } from "react";
import Title from "../../components/Title";
import { cities } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  const { addHotel } = useAppContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    city: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.address || !form.city) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    addHotel(form);
    setSuccess(true);
    setTimeout(() => navigate("/owner"), 1500);
  };

  return (
    <div className="max-w-lg">
      <Title
        align="left"
        font="outfit"
        title="Add New Branch"
        subtitle="Register a new hotel branch. Rooms added later can be assigned to any of your branches."
      />

      {success ? (
        <div className="mt-10 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
          ✅ Branch registered successfully! Redirecting to dashboard...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Hotel / Branch Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Urbanza Suites - Hyderabad"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              name="contact"
              type="text"
              placeholder="+91 9999 999999"
              value={form.contact}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Street Address
            </label>
            <input
              name="address"
              type="text"
              placeholder="123 Main Road, Area Name"
              value={form.address}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 text-sm"
              required
            />
          </div>

          <div className="max-w-48">
            <label className="text-sm font-medium text-gray-600">City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 text-sm"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded transition-colors cursor-pointer"
            >
              Register Branch
            </button>
            <button
              type="button"
              onClick={() => navigate("/owner")}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddHotel;
