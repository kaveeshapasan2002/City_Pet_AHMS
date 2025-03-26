///add mongoose
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const petSchema=new Schema({
    id:{
        type:String,
        required:true ///validation part
    },
    name:{
        type:String,
        required:true ///validation part
    },
    age:{
        type:Number,
        required:true ///validation part
    },
    breed:{
        type:String,
        required:true ///validation part
    },
    species:{
        type:String,
        required:true ///validation part
    },
    gender:{
        type:String,
        required:true ///validation part
    },
    bloodgroup:{
        type:String,
        required:true ///validation part
    },
    allergies:{
        type:String,
        required:true ///validation part
    },
    contact:{
        type:Number,
        required:true
    }


});

module.exports=mongoose.model(
    "PetModel",//thisfile name
    petSchema//function name
    
)