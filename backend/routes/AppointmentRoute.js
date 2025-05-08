const express=require("express");
const router=express.Router();

//insert model
const Appointments=require("../models/AppointmentModel")

//insert controller

const AppointmentController=require("../controllers/AppointmentControl")


router.get("/",AppointmentController.getAllAppointment);
router.post("/",AppointmentController.addAppointments);
router.get("/:id",AppointmentController.getById);
router.put("/:id",AppointmentController.updateAppointments);
router.delete("/:id",AppointmentController.deleteAppointments);

router.patch('/status/:id', AppointmentController.updateStatus);


  



//export
module.exports=router;