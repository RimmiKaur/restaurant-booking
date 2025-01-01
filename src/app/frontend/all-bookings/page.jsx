"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking.id !== id)); 
      setSelectedBooking(null); 
    } catch (err) {
      setError('Failed to delete booking.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded p-6 mt-10">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">
        All Bookings
      </h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <ul className="divide-y divide-gray-200">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <li key={booking.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">
                    <strong>{booking.name}</strong> - {booking.guests} guests
                  </p>
                  <p className="text-gray-500">
                    {new Date(booking.date).toDateString()} at {booking.time}
                  </p>
                </div>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  onClick={() =>
                    setSelectedBooking(
                      selectedBooking?.id === booking.id ? null : booking
                    )
                  }
                >
                  {selectedBooking?.id === booking.id ? 'Cancel' : 'Delete'}
                </button>
              </div>

              {selectedBooking?.id === booking.id && (
                <div className="mt-4 bg-gray-100 p-4 rounded shadow">
                  <h3 className="text-lg font-medium text-gray-800">Booking Details</h3>
                  <p className="text-gray-700">
                    <strong>Name:</strong> {booking.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Date:</strong> {new Date(booking.date).toDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Time:</strong> {booking.time}
                  </p>
                  <p className="text-gray-700">
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                  <p className="text-gray-700">
                    <strong>Contact:</strong> {booking.contact}
                  </p>

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      className="bg-gray-300 text-gray-800 py-1 px-3 rounded hover:bg-gray-400"
                      onClick={() => setSelectedBooking(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No bookings found.</p>
        )}
      </ul>

      <div className="mt-8 flex justify-center">
        <button
          className="bg-yellow-500 text-black py-2 px-6 rounded hover:bg-yellow-600"
          onClick={() => router.push('/')}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
