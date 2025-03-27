
const Medi = require("../models/MediModel");

/// display all medical records
const getAllMedi = async (req, res, next) => {
    let Medies;
    try {
        Medies = await Medi.find();
    } catch (err) {
        console.log(err);
    }
    /// Not found
    if (!Medies) {
        return res.status(404).json({ message: "Medical records not found" });
    }
    
    return res.status(200).json({ Medies });
};

// get medical record by Pet ID
const getByPetId = async (req, res, next) => {
    const petid = req.params.petid;

    let Medies;
    try {
        Medies = await Medi.find({ petid: petid }); 
    } catch (err) {
        console.log(err);
    }
    // when no records found
    if (!Medies || Medies.length === 0) {
        return res.status(404).json({ message: "No medical records found for this pet" });
    }
    return res.status(200).json({ Medies });
};

// add medical record for pet
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
    // when data not insert
    if (!Medies) {
        return res.status(404).send({ message: "Unable to add medical record" });
    }
    return res.status(200).json({ Medies });
};

///get medical record by index
const getByIndex = async (req, res, next) => {
    const index = req.params.index;

    let Medies;
    try {
        Medies = await Medi.findOne({ index: index });
    } catch (err) {
        console.log(err);
    }
    ///when record not available
    if (!Medies) {
        return res.status(404).send({ message: "Unable to find medical record" });
    }
    return res.status(200).json({ Medies });
};

// update medical record
const updateMedies = async (req, res, next) => {
    const index = req.params.index;
    const { vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory } = req.body;

    let Medies;
    try {
        Medies = await Medi.findOneAndUpdate(
            { index: index },
            { vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory },
            { new: true } // return the updated document
        );
    } catch (err) {
        console.log(err);
    }
    /// record  not update
    if (!Medies) {
        return res.status(404).send({ message: "Unable to update medical record" });
    }
    return res.status(200).json({ Medies });
};

/// delete medical record
const deleteMedies = async (req, res, next) => {
    const index = req.params.index;

    let Medies;
    try {
        Medies = await Medi.findOneAndDelete({ index: index });
    } catch (err) {
        console.log(err);
    }
    /// record not delete
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
