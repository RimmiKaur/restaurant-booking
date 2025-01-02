const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or fallback to 5000

// In-memory storage for bookings (temporary, for demonstration)
const bookings = [];

// Middleware
app.use(cors({
  origin: [
    'https://restaurant-booking-loqu.vercel.app', // Frontend domain
    'http://localhost:3000' // For local testing (optional)
  ],
}));
app.use(bodyParser.json());

// API Routes

// Check availability for a given date/time
app.get('/api/check-availability', (req, res) => {
  const { date, time } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  if (time) {
    // Check if a specific time slot is booked
    const isBooked = bookings.some(
      (booking) => booking.date === date && booking.time === time
    );

    return res.status(200).json({ available: !isBooked });
  } else {
    // Get all unavailable slots for a date
    const unavailableSlots = bookings
      .filter((booking) => booking.date === date)
      .map((booking) => booking.time);

    return res.status(200).json({ unavailableSlots });
  }
});

// Add a new booking
app.post('/api/bookings', (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  if (!date || !time || !guests || !name || !contact) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const isBooked = bookings.some(
    (booking) => booking.date === date && booking.time === time
  );

  if (isBooked) {
    return res.status(400).json({ message: 'The selected slot is already booked.' });
  }

  const newBooking = {
    id: bookings.length + 1,
    date,
    time,
    guests,
    name,
    contact,
  };
  bookings.push(newBooking);

  return res.status(201).json({ message: 'Booking successful!', booking: newBooking });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  return res.status(200).json(bookings);
});

// Delete a booking by ID
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;

  const bookingIndex = bookings.findIndex((booking) => booking.id === parseInt(id));

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  bookings.splice(bookingIndex, 1);
  return res.status(200).json({ message: 'Booking deleted successfully.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
