const Appointment=require("../models/AppointmentModel");

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
///Get by Id

const getById=async(req,res,next)=>{
    const nic=req.params.nic;

    let Appointments;
    try{
        Appointments = await Appointment.findOne({ nic: nic }); ////editing
    }catch(err){
        console.log(err);
    }
        //when user is not availale
        if(!Appointments){
            return res.status(404).send({message:"unable to find users"});
        }
        return res.status(200).json({Appointments});
}

//update details
const updateAppointments=async(req,res,next)=>{
    const nic=req.params.nic;
     const {name,contact,gmail,petID,appointmentType}=req.body;

    let Appointments;

    try{
        Appointments=await Appointment.updateOne({ nic: nic },
            {name:name,contact:contact,gmail:gmail,petID:petID,appointmentType:appointmentType});
            Appointments=await Appointments.save(); 
    }catch(err){
        console.log(err);
    }
        //when user is not update
        if(!Appointments){
            return res.status(404).send({message:"unable to Update users"});
        }
        return res.status(200).json({Appointments});

};
///delete detsils
const deleteAppointments=async(req,res,next)=>{
    const nic=req.params.nic;

    let Appointments;
    try{
        Appointments=await Appointment.deleteOne({ nic: nic })
    }catch(err){
        console.log(err);
    }
        //when user is not delete
        if(!Appointments){
            return res.status(404).send({message:"unable to Delete users"});
        }
        return res.status(200).json({Appointments});
}





exports.getAllAppointment=getAllAppointment;
exports.addAppointments=addAppointments;
exports.getById=getById;
exports.updateAppointments=updateAppointments;
exports.deleteAppointments=deleteAppointments;