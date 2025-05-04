const express=require("express");
const router=express.Router();

//insert Model
const Pet=require("../models/PetModel");


//insert user controller
const PetController=require("../controllers/PetController");



router.get("/",PetController.getAllPets);
router.post("/",PetController.addPets);
router.get("/:id",PetController.getById);
router.put("/:id",PetController.updatePets);

router.delete("/:id",PetController.deletePets);

router.get("/bycontact/:contact", PetController.getByContact);







//export
module.exports=router;
