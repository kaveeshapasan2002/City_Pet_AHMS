const Appointment=require("../models/AppointmentModel");
const { sendAppointmentStatusEmail } = require('../utils/emailService');


///Display part
const getAllAppointment=async(req,res,next)=>{
    
    let Appointments;

    try{
        Appointments=await Appointment.find();
    }catch(err){
        console.log(err);
    }
    //notfound
    if(!Appointments){
        return res.status(404).json({message:"Appointments not found"});

    }

    return res.status(200).json({Appointments});

};
///data insert
const addAppointments=async(req,res,next)=>{
    const {contact,petID,name,nic,gmail,appointmentType}=req.body;
    let Appointments;

    try{
        Appointments=new Appointment ({contact,petID,name,nic,gmail,appointmentType});
        await Appointments.save();
    }catch(err){
        console.log(err);
    }
    //when data is not inserting
    if(!Appointments){
        return res.status(404).send({message:"unable to add users"});
    }
    return res.status(200).json({Appointments});

};


// Get by ID 
const getById = async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      res.json({ appointment });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Update
  const updateAppointments = async (req, res) => {
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedAppointment) return res.status(404).json({ message: "Appointment not found" });
      res.json(updatedAppointment);
    } catch (err) {
      res.status(500).json({ message: "Update failed" });
    }
  };

///delete detsils
const deleteAppointments = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Appointment.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json({ message: "Appointment deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  };
  
  
  // update appoiment status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Send email notification
    await sendAppointmentStatusEmail(
      updatedAppointment.gmail,
      updatedAppointment.name,
      updatedAppointment,
      status
    ).catch(error => {
      console.error("Email failed to send:", error);
    });

    res.json(updatedAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
  
  
  



exports.updateStatus = updateStatus;
exports.getAllAppointment=getAllAppointment;
exports.addAppointments=addAppointments;
exports.getById=getById;
exports.updateAppointments=updateAppointments;
exports.deleteAppointments=deleteAppointments;