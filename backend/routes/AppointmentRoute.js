const express=require("express");
const router=express.Router();

//insert model
const Appointments=require("../models/AppointmentModel")

//insert controller

const AppointmentController=require("../controllers/AppointmentControl")


router.get("/",AppointmentController.getAllAppointment);
router.post("/",AppointmentController.addAppointments);
router.get("/:nic",AppointmentController.getById);
router.put("/general/:nic",AppointmentController.updateAppointments);
router.delete("/:nic",AppointmentController.deleteAppointments);

router.put('/:id',AppointmentController.updateStatus);


  



//export
module.exports=router;