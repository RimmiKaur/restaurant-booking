"use client";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleReserveNow = () => {
    router.push('frontend/book'); // Navigate to the booking page
  };

  const handleViewBookings = () => {
    router.push('frontend/all-bookings'); // Navigate to the all bookings page
  };

  return (
    <>
      <div className="relative bg-cover bg-center h-96">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center space-y-4">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Book Your Table Now!</h1>
            <button
              onClick={handleReserveNow}
              className="bg-yellow-500 text-black px-6 py-3 rounded hover:bg-yellow-600 mb-2"
            >
              Reserve Now
            </button>
            <button
              onClick={handleViewBookings}
              className="bg-lime-300 text-black px-6 py-3 rounded ml-4 hover:bg-lime-600"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
