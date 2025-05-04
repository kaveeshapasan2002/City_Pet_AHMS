const express=require("express");
const multer = require('multer');
const path = require('path');
const router=express.Router();


//Insert Model
const Medi=require("../models/MediModel");

//Insert user controller
const MediController=require("../controllers/MediController");
/*
router.get("/",MediController.getAllMedi);
router.get("/:id",MediController.getId);

router.post("/",MediController.addMedies);


router.get("/:index",MediController.getById); ///not working . medi update form not get data
router.put("/:index",MediController.updateMedies);
router.delete("/:index",MediController.deleteMedies);
*/

router.get("/", MediController.getAllMedi);                // Get all medical records
router.get("/:petid", MediController.getByPetId);              // Get medical records by Pet ID
router.get("/index/:index", MediController.getByIndex);     // Get medical record by Index

router.post("/", MediController.addMedies);                 // Add a new medical record

router.put("/:index", MediController.updateMedies);         // Update a medical record by Index
router.delete("/:index", MediController.deleteMedies);      // Delete a medical record by Index

module.exports=router;