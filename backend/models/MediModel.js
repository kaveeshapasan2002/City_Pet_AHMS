///add mongoose
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);


const mediSchema=new Schema({
    index:{
        type:Number,


    },
    petid:{
        type:String,
        required:true 
    },
    vaccinationState:{
        type:String,
        required:true 
    },
    vaccinationDate:{
        type:Date,
        default:null
    
    },
    visitDate:{
        type:Date,
        required:true 
    },
    reason:{
        type:String,
        required:true 
    },
    prescription:{
        type:String,
        required:true 
    },
    mediHistory:{
        type:String,
        required:true 
    }


});
mediSchema.plugin(AutoIncrement, { inc_field: "index" });

module.exports=mongoose.model(
    "MediModel",//thisfile name
    mediSchema//function name
    
)