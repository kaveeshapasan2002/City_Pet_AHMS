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
        required:true ///validation part
    },
    vaccinationState:{
        type:String,
        required:true ///validation part
    },
    vaccinationDate:{
        type:Date,
        default:null
    
    },
    visitDate:{
        type:Date,
        required:true ///validation part
    },
    reason:{
        type:String,
        required:true ///validation part
    },
    prescription:{
        type:String,
        required:true ///validation part
    },
    mediHistory:{
        type:String,
        required:true ///validation part
    }


});
mediSchema.plugin(AutoIncrement, { inc_field: "index" });

module.exports=mongoose.model(
    "MediModel",//thisfile name
    mediSchema//function name
    
)