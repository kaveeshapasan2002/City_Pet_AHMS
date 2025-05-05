const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const AppointmentSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    nic:{
        type:String,
        required:true
    },
    gmail:{
        type:String,
        required:true
    },
    petID:{
        type:String,
        required:true
    },
    appointmentType:{
        type:String,
        required:true,
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
