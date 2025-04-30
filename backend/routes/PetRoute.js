const express=require("express");
const router=express.Router();



//Insert Model
const Pet=require("../models/PetModel");


//Insert user controller
const PetController=require("../controllers/PetController");



router.get("/",PetController.getAllPets);
router.post("/",PetController.addPets);
router.get("/:id",PetController.getById);
router.put("/:id",PetController.updatePets);

router.delete("/:id",PetController.deletePets);






//export
module.exports=router;
