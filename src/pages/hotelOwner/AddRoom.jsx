import React, { useState } from "react";
import Title from "../../components/Title";
import { assets, roomsDummyData } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AddRoom = () => {
  const { addRoom, ownerHotels } = useAppContext();
  const navigate = useNavigate();

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [previews, setPreviews] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [selectedHotelId, setSelectedHotelId] = useState(
    ownerHotels.length > 0 ? ownerHotels[0]._id : "",
  );
  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: "",
    discount: 0,
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (key, file) => {
    if (!file) return;
    setImages((prev) => ({ ...prev, [key]: file }));
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [key]: previewUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedHotelId) {
      setError("Please select a hotel branch.");
      return;
    }
    if (!inputs.roomType) {
      setError("Please select a room type.");
      return;
    }
    if (!inputs.pricePerNight || Number(inputs.pricePerNight) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    setLoading(true);

    const selectedAmenities = Object.entries(inputs.amenities)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const uploadedFiles = Object.values(images).filter(Boolean);
    let imageUrls;

    if (uploadedFiles.length > 0) {
      try {
        imageUrls = await Promise.all(
          uploadedFiles.map((file) => fileToBase64(file)),
        );
      } catch {
        setError("Failed to process images. Please try again.");
        setLoading(false);
        return;
      }
    } else {
      imageUrls = roomsDummyData[0].images;
    }

    // Find the selected hotel object
    const selectedHotel = ownerHotels.find((h) => h._id === selectedHotelId);

    addRoom(
      {
        roomType: inputs.roomType,
        pricePerNight: Number(inputs.pricePerNight),
        discount: Number(inputs.discount) || 0,
        amenities: selectedAmenities,
        images: imageUrls,
      },
      selectedHotel,
    );

    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/owner/list-room"), 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subtitle="Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience."
      />

      {/* Hotel Branch Selector */}
      <div className="mt-8">
        <p className="text-gray-800 font-medium">Select Hotel Branch</p>
        <p className="text-xs text-gray-400 mb-2">
          Choose which branch this room belongs to.
        </p>

        {ownerHotels.length === 0 ? (
          <p className="text-red-500 text-sm">No hotels registered yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3 mt-2">
            {ownerHotels.map((h) => (
              <div
                key={h._id}
                onClick={() => setSelectedHotelId(h._id)}
                className={`cursor-pointer border-2 rounded-lg px-4 py-3 text-sm transition-all ${
                  selectedHotelId === h._id
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <p className="font-medium">{h.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {h.city} — {h.address}
                </p>
              </div>
            ))}

            {/* Add new branch shortcut */}
            <div
              onClick={() => navigate("/owner/add-hotel")}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span>
              <span>Add New Branch</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <p className="text-gray-800 mt-8">Images</p>
      <p className="text-xs text-gray-400 mb-2">
        Upload up to 4 images. If none uploaded, placeholder images will be
        used.
      </p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label
            htmlFor={`roomImage${key}`}
            key={key}
            className="cursor-pointer relative group"
          >
            <img
              src={previews[key] || assets.uploadArea}
              alt=""
              className="max-h-13 h-13 w-16 object-cover opacity-80 hover:opacity-100 transition-opacity rounded border border-gray-200"
            />
            {previews[key] && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                ✓
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) => handleImageChange(key, e.target.files[0])}
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4 flex-wrap">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={inputs.roomType}
            className="border border-gray-300 mt-1 rounded p-2 w-full"
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            min="1"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>
        <div>
          <p className="mt-4 text-gray-800">
            Discount <span className="text-xs">(%)</span>
          </p>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="100"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.discount}
            onChange={(e) => setInputs({ ...inputs, discount: e.target.value })}
          />
        </div>
      </div>

      <p className="text-gray-800 mt-6">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-600 max-w-sm gap-1">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <label
            key={index}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            {amenity}
          </label>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm mt-4">
          ✅ Room added successfully! Redirecting...
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer hover:bg-primary-dull transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          "Add Room"
        )}
      </button>
    </form>
  );
};

export default AddRoom;
