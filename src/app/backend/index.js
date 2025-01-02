const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for bookings (temporary, for demonstration)
const bookings = [];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://restaurant-booking-loqu.vercel.app', // Frontend domain
      'http://localhost:3000', // Local testing
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(bodyParser.json());
app.use(morgan('dev')); // Logs all incoming requests

// API Routes

// Check availability for a given date/time
app.get('/api/check-availability', (req, res) => {
  const { date, time } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  const unavailableSlots = bookings
    .filter((booking) => booking.date === date)
    .map((booking) => booking.time);

  if (time) {
    const isBooked = unavailableSlots.includes(time);
    return res.status(200).json({ available: !isBooked });
  }

  return res.status(200).json({ unavailableSlots });
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

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS error: You are not allowed to access this resource.' });
  }
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
