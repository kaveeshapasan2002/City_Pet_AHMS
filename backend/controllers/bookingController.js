const Booking = require("../Model/bookingModel");

//Data display part - Get all bookings
const getAllBookings = async(req, res, next) => {
    let bookings;

    //Get all bookings
    try {
        bookings = await Booking.find();
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Database error occurred"});
    } 

    //not found bookings
    if(!bookings) {
        return res.status(404).json({message: "No bookings found"});
    }

    //Display all bookings
    return res.status(200).json({bookings});
}

//Data insert part - Add new booking
const addBooking = async(req, res, next) => {
    const {boardingType, checkIn, checkOut, specialNotes, additionalServices} = req.body;

    let booking;

    try {
        booking = new Booking({
            boardingType,
            checkIn,
            checkOut,
            specialNotes,
            additionalServices
        });
        await booking.save();
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Unable to add booking", error: err.message});
    }

    //if not insert booking
    if(!booking) {
        return res.status(404).json({message: "Unable to add booking"});
    }
    return res.status(201).json({booking});
}

//Get booking by Id
const getBookingById = async(req, res, next) => {
    const id = req.params.id;

    let booking;

    try {
        booking = await Booking.findById(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Error retrieving booking"});
    }

    //if not available booking
    if(!booking) {
        return res.status(404).json({message: "Booking not found"});
    }
    return res.status(200).json({booking});
}

//Update booking details
const updateBooking = async(req, res, next) => {
    const id = req.params.id;
    const {boardingType, checkIn, checkOut, specialNotes, additionalServices} = req.body;

    let booking;

    try {
        booking = await Booking.findByIdAndUpdate(
            id,
            {
                boardingType,
                checkIn,
                checkOut,
                specialNotes,
                additionalServices
            },
            {new: true} // return the updated document
        );
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Error updating booking"});
    }

    //if not available booking
    if(!booking) {
        return res.status(404).json({message: "Unable to update booking details"});
    }
    return res.status(200).json({booking});
}

//Delete Booking
const deleteBooking = async(req, res, next) => {
    const id = req.params.id;

    let booking;

    try {
        booking = await Booking.findByIdAndDelete(id);
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Error deleting booking"});
    }

    //if not available booking
    if(!booking) {
        return res.status(404).json({message: "Booking not found or already deleted"});
    }
    return res.status(200).json({message: "Booking successfully deleted"});
}

module.exports = {
    getAllBookings,
    addBooking,
    getBookingById,
    updateBooking,
    deleteBooking
};