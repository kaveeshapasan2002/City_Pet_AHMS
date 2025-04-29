const Pet= require("../models/PetModel");

///Display part
const getAllPets=async(req,res,next)=>{
    
    let Pets;

    try{
        pets=await Pet.find();
    }catch(err){
        console.log(err);
    }
    //notfound
    if(!pets){
        return res.status(404).json({message:"User not found"});

    }
    //Display all users
    return res.status(200).json({pets});

};
///data insert
const addPets=async(req,res,next)=>{
    const {id,name,age,breed,species,gender,bloodgroup,allergies,contact}=req.body;
    let pets;

    try{
        pets=new Pet({id,name,age,breed,species,gender,bloodgroup,allergies,contact});
        await pets.save();
    }catch(err){
        console.log(err);
    }
    //when data is not inserting
    if(!pets){
        return res.status(404).send({message:"unable to add users"});
    }
    return res.status(200).json({pets});

};
///Get by Id

const getById=async(req,res,next)=>{
    const id=req.params.id;

    let pet;
    try{
        pet = await Pet.findOne({ id: id }); ////editing
    }catch(err){
        console.log(err);
    }
        //when user is not availale
        if(!pet){
            return res.status(404).send({message:"unable to find users"});
        }
        return res.status(200).json({pet});
}


//update details
const updatePets=async(req,res,next)=>{
    const id=req.params.id;
    const {name,age,breed,species,gender,bloodgroup,allergies,contact}=req.body;

    let pets;

    try{
        pets=await Pet.updateOne({ id: id },
            {name:name,age:age,breed:breed,species:species,gender:gender,bloodgroup:bloodgroup,allergies:allergies,contact:contact});
       pets=await pets.save(); 
    }catch(err){
        console.log(err);
    }
        //when user is not update
        if(!pets){
            return res.status(404).send({message:"unable to Update users"});
        }
        return res.status(200).json({pets});

};
///delete detsils
const deletePets=async(req,res,next)=>{
    const id=req.params.id;

    let pet;
    try{
        pet=await Pet.deleteOne({ id: id })
    }catch(err){
        console.log(err);
    }
        //when user is not delete
        if(!pet){
            return res.status(404).send({message:"unable to Delete users"});
        }
        return res.status(200).json({pet});
}













exports.getAllPets=getAllPets;
exports.addPets=addPets;
exports.getById=getById;
exports.updatePets=updatePets;
exports.deletePets=deletePets;


