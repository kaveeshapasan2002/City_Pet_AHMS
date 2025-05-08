const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const AppointmentSchema=new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
        trim: true
      },
      contact: {
        type: String, 
        required: [true, "Contact number is required"],
        match: [/^\d{10,15}$/, "Contact must be a valid phone number (10-15 digits)"]
      },
      nic: {
        type: String,
        required: [true, "NIC is required"],
        minlength: [5, "NIC must be at least 5 characters"],
        maxlength: [20, "NIC cannot exceed 20 characters"],
        trim: true
      },
      gmail: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
      },
      petID: {
        type: String,
        required: [true, "Pet ID is required"],
        minlength: [2, "Pet ID must be at least 2 characters"],
        maxlength: [30, "Pet ID cannot exceed 30 characters"],
        trim: true
      },
      appointmentType: {
        type: String,
        required: [true, "Appointment type is required"],
        enum: {
          values: ["Vaccination", "Emergency", "General Checkup", "Surgery", "Dental Care"],
        }
      },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Rejected'],
        default: 'Pending'  
      }

});
module.exports=mongoose.model(
    "AppointmentModel",
    AppointmentSchema
)
