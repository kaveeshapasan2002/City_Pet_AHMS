const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById
} = require('../controllers/bookingController');

// Routes without authentication
router.route('/')
  .post(createBooking)
  .get(getAllBookings);

router.route('/:id')
  .get(getBookingById);

module.exports = router;