/*const Medi=require("../Model/MediModel");


///Display part
const getAllMedi=async(req,res,next)=>{
    
    let Medies;

    try{
        Medies=await Medi.find();
    }catch(err){
        console.log(err);
    }
    //notfound
    if(!Medies){
        return res.status(404).json({message:"User not found"});

    }
    //Display all users
    return res.status(200).json({Medies});

};
const getId=async(req,res,next)=>{
    const id=req.params.id;

    let medies;
    try{
        medies = await Medi.find({ id: id }); ////editing
    }catch(err){
        console.log(err);
    }
        //when user is not availale
        if(!medies){
            return res.status(404).send({message:"unable to find users"});
        }
        return res.status(200).json({medies});
}
///data insert
const addMedies=async(req,res,next)=>{
    const {id,vaccinationState,vaccinationDate,visitDate,reason,prescription,mediHistory}=req.body;
    let Medies;

    try{
        const lastMedi = await Medi.findOne().sort({ index: -1 });
        const newIndex = lastMedi ? lastMedi.index + 1 : 1; 
        Medies=new Medi({index: newIndex,id,vaccinationState,vaccinationDate,visitDate,reason,prescription,mediHistory});
        await Medies.save();
    }catch(err){
        console.log(err);
    }
    //when data is not inserting
    if(!Medies){
        return res.status(404).send({message:"unable to add Medi"});
    }
    return res.status(200).json({Medies});

};
///Get by Index

const getById=async(req,res,next)=>{
    const index =req.params.id;

    let Medies;
    try{
        Medies = await Medi.find({ index: index  });
    }catch(err){
        console.log(err);
    }
        //when user is not availale
        if(!Medies){
            return res.status(404).send({message:"unable to find users"});
        }
        return res.status(200).json({Medies});
}


//update details
const updateMedies=async(req,res,next)=>{
    const index = req.params.index; 
    const {vaccinationState,vaccinationDate,visitDate,reason,prescription,mediHistory}=req.body;

    let Medies;

    try{
        Medies=await Medi.updateOne({ index: index  },
            {vaccinationState:vaccinationState,vaccinationDate:vaccinationDate,visitDate:visitDate,reason:reason,prescription:prescription,mediHistory:mediHistory});
            Medies=await Medies.save(); 
    }catch(err){
        console.log(err);
    }
        //when user is not update
        if(!Medies){
            return res.status(404).send({message:"unable to Update users"});
        }
        return res.status(200).json({Medies});

};
///delete detsils
const deleteMedies=async(req,res,next)=>{
    const index = req.params.index;

    let Medies;
    try{
        Medies=await Medi.deleteOne({ index: index })
    }catch(err){
        console.log(err);
    }
        //when user is not delete
        if(!Medies){
            return res.status(404).send({message:"unable to Delete users"});
        }
        return res.status(200).json({Medies});
}

exports.getAllMedi=getAllMedi;
exports.getId=getId;
exports.addMedies=addMedies;
exports.getById=getById;
exports.updateMedies=updateMedies;
exports.deleteMedies=deleteMedies;*/
const Medi = require("../models/MediModel");

// Display all medical records
const getAllMedi = async (req, res, next) => {
    let Medies;
    try {
        Medies = await Medi.find();
    } catch (err) {
        console.log(err);
    }
    // Not found
    if (!Medies) {
        return res.status(404).json({ message: "Medical records not found" });
    }
    // Display all records
    return res.status(200).json({ Medies });
};




// Get medical records by Pet ID
const getByPetId = async (req, res, next) => {
    const petid = req.params.petid;

    let Medies;
    try {
        Medies = await Medi.find({ petid: petid }); // Filter by pet ID
    } catch (err) {
        console.log(err);
    }
    // When no records are found
    if (!Medies || Medies.length === 0) {
        return res.status(404).json({ message: "No medical records found for this pet" });
    }
    return res.status(200).json({ Medies });
};

// Add a medical record for a specific pet
const addMedies = async (req, res, next) => {
    const { petid, vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory } = req.body;
    let Medies;

    try {
        const lastMedi = await Medi.findOne().sort({ index: -1 });
        const newIndex = lastMedi ? lastMedi.index + 1 : 1; 
        Medies = new Medi({ index: newIndex, petid, vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory });
        await Medies.save();
    } catch (err) {
        console.log(err);
    }
    // When data is not inserting
    if (!Medies) {
        return res.status(404).send({ message: "Unable to add medical record" });
    }
    return res.status(200).json({ Medies });
};

// Get medical record by Index
const getByIndex = async (req, res, next) => {
    const index = req.params.index;

    let Medies;
    try {
        Medies = await Medi.findOne({ index: index });
    } catch (err) {
        console.log(err);
    }
    // When record is not available
    if (!Medies) {
        return res.status(404).send({ message: "Unable to find medical record" });
    }
    return res.status(200).json({ Medies });
};

// Update medical record by Index
const updateMedies = async (req, res, next) => {
    const index = req.params.index;
    const { vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory } = req.body;

    let Medies;
    try {
        Medies = await Medi.findOneAndUpdate(
            { index: index },
            { vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory },
            { new: true } // Return the updated document
        );
    } catch (err) {
        console.log(err);
    }
    // When record is not updated
    if (!Medies) {
        return res.status(404).send({ message: "Unable to update medical record" });
    }
    return res.status(200).json({ Medies });
};

// Delete medical record by Index
const deleteMedies = async (req, res, next) => {
    const index = req.params.index;

    let Medies;
    try {
        Medies = await Medi.findOneAndDelete({ index: index });
    } catch (err) {
        console.log(err);
    }
    // When record is not deleted
    if (!Medies) {
        return res.status(404).send({ message: "Unable to delete medical record" });
    }
    return res.status(200).json({ message: "Medical record deleted successfully" });
};

exports.getAllMedi = getAllMedi;
exports.getByPetId = getByPetId;
exports.addMedies = addMedies;
exports.getByIndex = getByIndex;
exports.updateMedies = updateMedies;
exports.deleteMedies = deleteMedies;
