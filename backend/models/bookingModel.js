const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    boardingType: {
        type: String,  // data type 
        required: true, // validate
    },
    checkIn: {
        type: Date,  // data type 
        required: true, // validate   
    },
    checkOut: {
        type: Date,  // data type 
        required: true, // validate   
    },
    specialNotes: {
        type: String,  // data type  
    },
    additionalServices: {
        type: String,
        required: true
    }
}, {
    timestamps: true // adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model(
    "Booking", // collection name will be "bookings" in MongoDB
    bookingSchema
);