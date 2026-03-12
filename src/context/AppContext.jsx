import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { roomsDummyData, hotelDummyData } from "../assets/assets";

const AppContext = createContext();

const DUMMY_OWNER_ID =
  import.meta.env.VITE_DUMMY_OWNER_ID || "demo_owner_placeholder";

const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// hotelsByOwner shape: { [ownerId]: [ hotel1, hotel2, ... ] }
const loadHotelsByOwner = () => {
  try {
    const stored = localStorage.getItem("app_hotels_by_owner");
    const parsed = stored ? JSON.parse(stored) : {};

    // Migrate old format: { [ownerId]: hotelObject } → { [ownerId]: [hotelObject] }
    const migrated = {};
    for (const [ownerId, value] of Object.entries(parsed)) {
      migrated[ownerId] = Array.isArray(value) ? value : [value];
    }

    // Always ensure dummy owner has their hotel
    const dummyHotels = migrated[DUMMY_OWNER_ID] || [];
    const alreadyHasDummy = dummyHotels.some(
      (h) => h._id === hotelDummyData._id,
    );
    if (!alreadyHasDummy) {
      migrated[DUMMY_OWNER_ID] = [hotelDummyData, ...dummyHotels];
    }

    return migrated;
  } catch {
    return { [DUMMY_OWNER_ID]: [hotelDummyData] };
  }
};

const loadRooms = () => {
  try {
    const stored = localStorage.getItem("app_rooms");
    const parsed = stored ? JSON.parse(stored) : [];
    const taggedDummyRooms = roomsDummyData.map((r) => ({
      ...r,
      ownerId: DUMMY_OWNER_ID,
    }));
    const dummyRoomIds = roomsDummyData.map((r) => r._id);
    const userAddedRooms = parsed
      .filter((r) => !dummyRoomIds.includes(r._id))
      .map((r) => (r.ownerId ? r : { ...r, ownerId: DUMMY_OWNER_ID }));
    return [...taggedDummyRooms, ...userAddedRooms];
  } catch {
    return roomsDummyData.map((r) => ({ ...r, ownerId: DUMMY_OWNER_ID }));
  }
};

export const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();

  const [rooms, setRooms] = useState(loadRooms);
  const [bookings, setBookings] = useState(() =>
    loadFromStorage("app_bookings", []),
  );
  const [hotelsByOwner, setHotelsByOwner] = useState(loadHotelsByOwner);
  const [searchQuery, setSearchQuery] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => saveToStorage("app_rooms", rooms), [rooms]);
  useEffect(() => saveToStorage("app_bookings", bookings), [bookings]);
  useEffect(
    () => saveToStorage("app_hotels_by_owner", hotelsByOwner),
    [hotelsByOwner],
  );

  const currentUser =
    isLoaded && user
      ? {
          _id: user.id,
          username: user.fullName || user.username || user.firstName || "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          image: user.imageUrl || "",
        }
      : null;

  // ownerHotels = array of all hotels for current owner
  const ownerHotels = currentUser ? hotelsByOwner[currentUser._id] || [] : [];

  const isOwner = ownerHotels.length > 0;

  // Primary hotel (first one) — used for backward compat
  const hotel = ownerHotels[0] || null;

  // Register first hotel (from HotelReg modal)
  const setHotel = (newHotel) => {
    if (!currentUser) return;
    setHotelsByOwner((prev) => {
      const existing = prev[currentUser._id] || [];
      const alreadyExists = existing.some((h) => h._id === newHotel._id);
      if (alreadyExists) return prev;
      return { ...prev, [currentUser._id]: [...existing, newHotel] };
    });
  };

  // Add a new branch hotel
  const addHotel = (newHotel) => {
    if (!currentUser) return;
    const hotel = {
      ...newHotel,
      _id: `hotel_${Date.now()}`,
      owner: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    setHotelsByOwner((prev) => ({
      ...prev,
      [currentUser._id]: [...(prev[currentUser._id] || []), hotel],
    }));
    return hotel;
  };

  // ── Room Actions ──────────────────────────────────────────

  const addRoom = (newRoom, selectedHotel) => {
    const roomHotel = selectedHotel || hotel;
    const room = {
      ...newRoom,
      _id: `room_${Date.now()}`,
      ownerId: currentUser?._id,
      hotel: roomHotel,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    setRooms((prev) => [room, ...prev]);
    return room;
  };

  const editRoom = (updatedRoom) => {
    setRooms((prev) =>
      prev.map((r) =>
        r._id === updatedRoom._id
          ? { ...r, ...updatedRoom, updatedAt: new Date().toISOString() }
          : r,
      ),
    );
  };

  const deleteRoom = (roomId) => {
    setRooms((prev) => prev.filter((r) => r._id !== roomId));
  };

  const toggleRoomAvailability = (roomId) => {
    setRooms((prev) =>
      prev.map((r) =>
        r._id === roomId ? { ...r, isAvailable: !r.isAvailable } : r,
      ),
    );
  };

  // ── Booking Actions ───────────────────────────────────────

  const createBooking = ({ roomId, checkInDate, checkOutDate, guests }) => {
    if (!currentUser) return { error: "auth_required" };
    const room = rooms.find((r) => r._id === roomId);
    if (!room) return null;

    const nights = Math.max(
      1,
      Math.round(
        (new Date(checkOutDate) - new Date(checkInDate)) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const totalPrice = Math.round(
      room.pricePerNight * nights * (1 - (room.discount || 0) / 100),
    );

    const booking = {
      _id: `booking_${Date.now()}`,
      userId: currentUser._id,
      ownerId: room.ownerId,
      user: currentUser,
      room,
      hotel: room.hotel,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests,
      status: "pending",
      paymentMethod: "Pay At Hotel",
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const markAsPaid = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, isPaid: true, paymentMethod: "Card" } : b,
      ),
    );
  };

  // ── Derived Data ──────────────────────────────────────────

  const userBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser._id)
    : [];

  const ownerBookings = currentUser
    ? bookings.filter((b) => b.ownerId === currentUser._id)
    : [];

  const ownerRooms =
    currentUser && isOwner
      ? rooms.filter((r) => r.ownerId === currentUser._id)
      : [];

  const dashboardData = {
    totalBookings: ownerBookings.length,
    totalRevenue: ownerBookings
      .filter((b) => b.isPaid)
      .reduce((sum, b) => sum + b.totalPrice, 0),
    bookings: ownerBookings,
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        ownerRooms,
        ownerHotels,
        setRooms,
        bookings,
        userBookings,
        hotel,
        setHotel,
        addHotel,
        currentUser,
        isOwner,
        searchQuery,
        setSearchQuery,
        addRoom,
        editRoom,
        deleteRoom,
        toggleRoomAvailability,
        createBooking,
        markAsPaid,
        dashboardData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
