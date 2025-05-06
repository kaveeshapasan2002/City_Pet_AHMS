// controllers/boardingController.js
const Boarding = require('../models/Boarding');

// @desc    Create a new boarding booking
exports.createBoarding = async (req, res) => {
    try {
        const { petName, boardingType, checkInDate, checkOutDate, additionalServices, specialNotes } = req.body;
        
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        const pricePerDay = {
            'Standard': 30,
            'Deluxe': 50,
            'Premium': 80
        };
        
        const servicesPrices = {
            'Grooming': 40,
            'Training': 50,
            'Special Diet': 20,
            'Health Check': 35,
            'Playtime': 15
        };
        
        let totalPrice = pricePerDay[boardingType] * days;
        if (additionalServices && servicesPrices[additionalServices]) {
            totalPrice += servicesPrices[additionalServices];
        }
        
        const newBooking = new Boarding({
            user: req.user.id,
            petName,
            boardingType,
            checkInDate,
            checkOutDate,
            additionalServices,
            specialNotes,
            totalPrice
        });
        
        const booking = await newBooking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all boarding bookings for logged in user
exports.getUserBoardings = async (req, res) => {
    try {
        const bookings = await Boarding.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get boarding booking by ID
exports.getBoardingById = async (req, res) => {
    try {
        const booking = await Boarding.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update boarding booking
exports.updateBoarding = async (req, res) => {
    try {
        const booking = await Boarding.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status !== 'Pending' && req.user.role !== 'Admin') {
            return res.status(400).json({ message: 'Cannot update confirmed bookings' });
        }
        const updatedBooking = await Boarding.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel boarding booking
exports.cancelBoarding = async (req, res) => {
    try {
        const booking = await Boarding.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status !== 'Pending' && req.user.role !== 'Admin') {
            return res.status(400).json({ message: 'Cannot cancel confirmed bookings' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update booking status (Admin only)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const booking = await Boarding.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        booking.status = status;
        await booking.save();
        res.json({ message: `Booking status updated to ${status}`, booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete booking
exports.deleteBoarding = async (req, res) => {
    try {
      const booking = await Boarding.findById(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if the user is authorized to delete this booking
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      // Permanently delete the booking from the database
      await Boarding.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Booking permanently deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const bookings = await Boarding.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

