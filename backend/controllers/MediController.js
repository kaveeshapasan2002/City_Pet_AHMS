
const Medi = require("../models/MediModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage for prescription files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp + original name
        const uniqueName = `${Date.now()}-${path.basename(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Configure multer with file filters
const fileFilter = (req, file, cb) => {
    // Accept PDF and common image formats
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and image files are allowed for prescriptions"));
    }
};

// Initialize multer upload with 5MB size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
}).single('prescriptionFile');

// Get all medical records
const getAllMedi = async (req, res, next) => {
    let Medies;
    try {
        Medies = await Medi.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    if (!Medies) {
        return res.status(404).json({ message: "Medical records not found" });
    }
    return res.status(200).json({ Medies });
};

// Get medical records by Pet ID
const getByPetId = async (req, res, next) => {
    const petid = req.params.petid;
    let Medies;
    try {
        Medies = await Medi.find({ petid: petid });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    if (!Medies || Medies.length === 0) {
        return res.status(404).json({ message: "No medical records found for this pet" });
    }
    return res.status(200).json({ Medies });
};

// Add medical record with file upload support
const addMedies = async (req, res, next) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // Multer error (file size, etc.)
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            // Other errors (file type, etc.)
            return res.status(400).json({ message: err.message });
        }

     
        const { petid, vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory } = req.body;
        
       
        const prescriptionFile = req.file ? `/uploads/${req.file.filename}` : null;
        
        let Medies;
        try {
            const lastMedi = await Medi.findOne().sort({ index: -1 });
            const newIndex = lastMedi ? lastMedi.index + 1 : 1;
            
            Medies = new Medi({
                index: newIndex,
                petid,
                vaccinationState,
                vaccinationDate: vaccinationState === "Yes" ? vaccinationDate : null,
                visitDate,
                reason,
                prescription,
                mediHistory,
                prescriptionFile
            });
            
            await Medies.save();
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to save medical record" });
        }
        
        if (!Medies) {
            return res.status(404).json({ message: "Unable to add medical record" });
        }
        
        return res.status(200).json({ Medies });
    });
};

// Get medical record by index
const getByIndex = async (req, res, next) => {
    const index = req.params.index;
    let Medies;
    try {
        Medies = await Medi.findOne({ index: index });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    if (!Medies) {
        return res.status(404).json({ message: "Unable to find medical record" });
    }
    return res.status(200).json({ Medies });
};

// Update medical record with file support
const updateMedies = async (req, res, next) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        
        const index = req.params.index;
        const { vaccinationState, vaccinationDate, visitDate, reason, prescription, mediHistory } = req.body;
        
        // Prepare update data
        const updateData = {
            vaccinationState,
            vaccinationDate: vaccinationState === "Yes" ? vaccinationDate : null,
            visitDate,
            reason,
            prescription,
            mediHistory
        };
        
        // Add file path if a new file was uploaded
        if (req.file) {
            updateData.prescriptionFile = `/uploads/${req.file.filename}`;
            
            // Optional: Delete old file if exists
            try {
                const oldRecord = await Medi.findOne({ index: index });
                if (oldRecord && oldRecord.prescriptionFile) {
                    const oldFilePath = path.join(__dirname, '..', oldRecord.prescriptionFile);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
            } catch (err) {
                console.log("Error removing old file:", err);
            }
        }
        
        let Medies;
        try {
            Medies = await Medi.findOneAndUpdate(
                { index: index },
                updateData,
                { new: true }
            );
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to update medical record" });
        }
        
        if (!Medies) {
            return res.status(404).json({ message: "Unable to update medical record" });
        }
        
        return res.status(200).json({ Medies });
    });
};

// Delete medical record
const deleteMedies = async (req, res, next) => {
    const index = req.params.index;
    
   
    let record;
    try {
        record = await Medi.findOne({ index: index });
    } catch (err) {
        console.log(err);
    }
    
   
    let Medies;
    try {
        Medies = await Medi.findOneAndDelete({ index: index });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    
    if (!Medies) {
        return res.status(404).json({ message: "Unable to delete medical record" });
    }
    
    // Delete associated file if exists
    if (record && record.prescriptionFile) {
        try {
            const filePath = path.join(__dirname, '..', record.prescriptionFile);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.log("Error deleting file:", err);
        }
    }
    
    return res.status(200).json({ message: "Medical record deleted successfully" });
};

module.exports = {
    getAllMedi,
    getByPetId,
    addMedies,
    getByIndex,
    updateMedies,
    deleteMedies
};
