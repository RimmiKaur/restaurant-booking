"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Book() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestCount, setGuestCount] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState({});
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const sixMonthsFromToday = new Date();
    sixMonthsFromToday.setMonth(today.getMonth() + 6);

    setMinDate(today.toISOString().split("T")[0]);
    setMaxDate(sixMonthsFromToday.toISOString().split("T")[0]);
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 12;
    let period = "AM";

    for (let i = 0; i < 15; i++) {
      const slot = `${hour}:00 ${period}`;
      slots.push(slot);

      hour++;
      if (hour === 13) {
        hour = 1;
        period = period === "AM" ? "PM" : "AM";
      }
    }
    return slots;
  };

  const handleDateChange = async (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    setTimeSlots(generateTimeSlots());
    setSelectedSlot(null);

    try {
      const response = await axios.get(
        `https://restaurant-booking-yxt7.onrender.com/api/check-availability?date=${selected}`
      );
      setUnavailableSlots(response.data.unavailableSlots || []);
    } catch (error) {
      console.error("Error fetching unavailable slots:", error);
    }
  };

  const handleSlotClick = (slot) => {
    if (unavailableSlots.includes(slot)) {
      alert("The selected slot is already booked. Please choose another.");
    } else {
      setSelectedSlot(slot);
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!selectedDate) validationErrors.date = "Please select a date.";
    if (!selectedSlot) validationErrors.slot = "Please select a time slot.";
    if (!guestCount || guestCount <= 0)
      validationErrors.guestCount = "Please enter a valid number of guests.";
    if (!name.trim()) validationErrors.name = "Name is required.";
    if (!/^\d{10}$/.test(contact))
      validationErrors.contact = "Please enter a valid 10-digit phone number.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const bookingDetails = {
        date: selectedDate,
        time: selectedSlot,
        guests: guestCount,
        name,
        contact,
      };

      await axios.post("https://restaurant-booking-yxt7.onrender.com/api/bookings", bookingDetails);

      router.push(
        `/frontend/summary?date=${selectedDate}&time=${selectedSlot}&guests=${guestCount}&name=${name}&contact=${contact}`
      );
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="max-w-lg mt-[30px] mx-auto bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Book a Table</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Date</h3>
          <input
            type="date"
            onChange={handleDateChange}
            value={selectedDate || ""}
            min={minDate}
            max={maxDate}
            className="w-full border rounded px-4 py-2 text-black focus:ring focus:ring-yellow-500"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {selectedDate && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Available Slots for {new Date(selectedDate).toDateString()}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {generateTimeSlots().map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  className={`py-2 rounded ${
                    unavailableSlots.includes(slot)
                      ? "bg-red-500 text-white cursor-not-allowed"
                      : selectedSlot === slot
                      ? "bg-green-800 text-white"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                  onClick={() => handleSlotClick(slot)}
                  disabled={unavailableSlots.includes(slot)} // Disable unavailable slots
                >
                  {slot}
                </button>
              ))}
            </div>

            {errors.slot && <p className="text-red-500 text-sm mt-1">{errors.slot}</p>}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            type="number"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full border rounded px-4 py-2 text-black focus:ring focus:ring-yellow-500"
            placeholder="Number of Guests"
          />
          {errors.guestCount && (
            <p className="text-red-500 text-sm mt-1">{errors.guestCount}</p>
          )}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-4 py-2 text-black focus:ring focus:ring-yellow-500"
            placeholder="Your Name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border rounded px-4 py-2 text-black focus:ring focus:ring-yellow-500"
            placeholder="Contact Number"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600"
          >
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  );
}
