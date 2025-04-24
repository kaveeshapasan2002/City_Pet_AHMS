///add mongoose
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const petSchema=new Schema({
    id:{
        type:String,
        required:true 
    },
    name:{
        type:String,
        required:true,
        minlength: 2,
        maxlength: 50,
    },
    age:{
        type:Number,
        required:true,
        min: 0,
    },
    breed:{
        type:String,
        required:true 
    },
    species:{
        type:String,
        required:true 
    },
    gender:{
        type:String,
        required:true ,
        enum: ["Male", "Female", "Other"],
    },
    bloodgroup:{
        type:String,
        required:true ,
         match: /^[A|B|AB|O][+-]$/
    },
    allergies:{
        type:String,
        required:true 
    },
    contact:{
        type:Number,
        required:true,
        match: /^[0-9]{10}$/,
    }


});

module.exports=mongoose.model(
    "PetModel",//thisfile name
    petSchema//function name
    
)