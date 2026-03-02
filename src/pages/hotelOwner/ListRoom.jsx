import React, { useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const EditModal = ({ room, onSave, onClose }) => {
  const [inputs, setInputs] = useState({
    roomType: room.roomType,
    pricePerNight: room.pricePerNight,
    discount: room.discount || 0,
    amenities: {
      "Free WiFi": room.amenities.includes("Free WiFi"),
      "Free Breakfast": room.amenities.includes("Free Breakfast"),
      "Room Service": room.amenities.includes("Room Service"),
      "Mountain View": room.amenities.includes("Mountain View"),
      "Pool Access": room.amenities.includes("Pool Access"),
    },
  });

  const handleSave = () => {
    const selectedAmenities = Object.entries(inputs.amenities)
      .filter(([, v]) => v)
      .map(([k]) => k);
    onSave({
      ...room,
      roomType: inputs.roomType,
      pricePerNight: Number(inputs.pricePerNight),
      discount: Number(inputs.discount),
      amenities: selectedAmenities,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Room</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm text-gray-600 font-medium">Room Type</label>
            <select
              value={inputs.roomType}
              onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full mt-1 text-sm"
            >
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Luxury Room">Luxury Room</option>
              <option value="Family Suite">Family Suite</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Price/night</label>
            <input
              type="number"
              min="1"
              value={inputs.pricePerNight}
              onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })}
              className="border border-gray-300 rounded p-2 w-24 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Discount %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={inputs.discount}
              onChange={(e) => setInputs({ ...inputs, discount: e.target.value })}
              className="border border-gray-300 rounded p-2 w-20 mt-1 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 font-medium">Amenities</label>
          <div className="flex flex-col gap-1 mt-2">
            {Object.keys(inputs.amenities).map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.amenities[amenity]}
                  onChange={() =>
                    setInputs({
                      ...inputs,
                      amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] },
                    })
                  }
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ListRoom = () => {
  const { ownerRooms: rooms, toggleRoomAvailability, editRoom, deleteRoom } = useAppContext();
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleSave = (updatedRoom) => {
    editRoom(updatedRoom);
    setEditingRoom(null);
  };

  const handleDelete = (roomId) => {
    setDeletingId(roomId);
  };

  const confirmDelete = () => {
    deleteRoom(deletingId);
    setDeletingId(null);
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subtitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <p className="text-gray-500 mt-8">All Rooms ({rooms.length})</p>

      {rooms.length === 0 ? (
        <p className="text-gray-400 text-sm mt-4">No rooms added yet. <Link to="/owner/add-room" className="text-blue-500 underline">Add a room</Link></p>
      ) : (
        <div className="w-full max-w-4xl text-left border border-gray-300 rounded-lg max-h-96 overflow-y-scroll mt-3">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-2">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium text-sm">Name</th>
                <th className="py-3 px-4 text-gray-800 font-medium text-sm max-sm:hidden">Amenities</th>
                <th className="py-3 px-4 text-gray-800 font-medium text-sm">Price/night</th>
                <th className="py-3 px-4 text-gray-800 font-medium text-sm text-center">Available</th>
                <th className="py-3 px-4 text-gray-800 font-medium text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rooms.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    <p className="font-medium">{item.roomType}</p>
                    {item.discount > 0 && (
                      <span className="text-xs text-orange-500">{item.discount}% off</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-500 border-t border-gray-300 max-sm:hidden text-xs">
                    {item.amenities.join(", ")}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    ${item.pricePerNight}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300">
                    <label className="relative inline-flex items-center cursor-pointer justify-center w-full ">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isAvailable !== false}
                        onChange={() => toggleRoomAvailability(item._id)}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-2.5 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingRoom(item)}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 text-xs bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingRoom && (
        <EditModal
          room={editingRoom}
          onSave={handleSave}
          onClose={() => setEditingRoom(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <p className="text-4xl mb-3">🗑️</p>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Room?</h2>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeletingId(null)}
                className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListRoom;
