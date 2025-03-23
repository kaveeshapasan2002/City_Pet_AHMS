const express = require("express");
const router = express.Router();

//Import Model
const Booking = require("../Model/bookingModel");

//Import booking controller
const BookingController = require("../controllers/bookingController");

// Define routes
router.get("/", BookingController.getAllBookings);
router.post("/", BookingController.addBooking);
router.get("/:id", BookingController.getBookingById);
router.put("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);

//export router
module.exports = router;