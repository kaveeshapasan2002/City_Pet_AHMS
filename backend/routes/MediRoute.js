const express=require("express");
const multer = require('multer');
const path = require('path');
const router=express.Router();


//Insert Model
const Medi=require("../models/MediModel");

//Insert user controller
const MediController=require("../controllers/MediController");

router.get("/", MediController.getAllMedi);               
router.get("/:petid", MediController.getByPetId);             
router.get("/index/:index", MediController.getByIndex);     

router.post("/", MediController.addMedies);               

router.put("/:index", MediController.updateMedies);         
router.delete("/:index", MediController.deleteMedies);    

module.exports=router;