import React from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { dashboardData, markAsPaid, ownerHotels } = useAppContext();
  const navigate = useNavigate();

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subtitle="Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations."
      />
      <div className="flex gap-4 my-8 flex-wrap">
        {/* Total Bookings */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>
        {/* Total Revenue */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">
              $ {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
        {/* Total Branches */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img src={assets.homeIcon} alt="" className="max-sm:hidden h-10" />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Branches</p>
            <p className="text-neutral-400 text-base">{ownerHotels.length}</p>
          </div>
        </div>
      </div>

      {/* My Branches */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl text-blue-950/70 font-medium">My Branches</h2>
        <button
          onClick={() => navigate("/owner/add-hotel")}
          className="text-sm text-indigo-500 hover:text-indigo-700 border border-indigo-200 px-3 py-1 rounded transition-colors cursor-pointer"
        >
          + Add Branch
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        {ownerHotels.map((h) => (
          <div
            key={h._id}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white shadow-sm"
          >
            <p className="font-medium text-gray-800">{h.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {h.city} — {h.address}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Bookings
      </h2>
      {dashboardData.bookings.length === 0 ? (
        <p className="text-gray-400 text-sm">No bookings yet.</p>
      ) : (
        <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium">
                  User Name
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                  Room Name
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  Total Amount
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dashboardData.bookings.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.user.username}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.room.roomType}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    ${item.totalPrice}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 flex justify-center">
                    <button
                      onClick={() => !item.isPaid && markAsPaid(item._id)}
                      className={`py-1 px-3 text-xs rounded-full transition-colors ${
                        item.isPaid
                          ? "bg-green-200 text-green-600 cursor-default"
                          : "bg-amber-200 text-yellow-600 hover:bg-amber-300 cursor-pointer"
                      }`}
                    >
                      {item.isPaid ? "Completed" : "Mark as Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
