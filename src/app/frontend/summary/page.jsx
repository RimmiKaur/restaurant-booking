"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Summary() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for booking details
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Extract query parameters when the component mounts
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const guests = searchParams.get('guests');
    const name = searchParams.get('name');
    const contact = searchParams.get('contact');

    if (date && time && guests && name && contact) {
      setBookingDetails({ date, time, guests, name, contact });
    } else {
      setBookingDetails(null);
    }
  }, [searchParams]);

  if (!bookingDetails) {
    return (
      <p className="text-red-500 text-center mt-10">
        No booking details found.{' '}
        <button
          onClick={() => router.push('/')}
          className="text-blue-500 underline hover:text-blue-700"
        >
          Go to Home
        </button>
      </p>
    );
  }

  const { date, time, guests, name, contact } = bookingDetails;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded p-6 mt-10">
      <h2 className="text-3xl font-semibold mb-4 text-green-600 text-center">
        Booking Confirmed!
      </h2>
      <p className="text-gray-700 text-center mb-6">Thank you for your reservation, {name}!</p>
      <ul className="text-gray-800 space-y-2">
        <li>Date: <strong>{new Date(date).toDateString()}</strong></li>
        <li>Time: <strong>{time}</strong></li>
        <li>Guests: <strong>{guests}</strong></li>
        <li>Contact: <strong>{contact}</strong></li>
      </ul>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => router.push('/')}
          className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600"
        >
          Go to Home
        </button>
        <button
          onClick={() => router.push('frontend/all-bookings')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          View All Bookings
        </button>
      </div>
    </div>
  );
}
