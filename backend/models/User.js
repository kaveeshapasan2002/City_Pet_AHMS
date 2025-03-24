/* const mongoose=require('mongoose');//mongoose is odm library
const bcrypt=require("bcryptjs");// library is used to hash passwords ....that is enhancing secuirty by encryping passwords before saving them.this ensures that passwords not plain text

const userSchema=new mongoose.Schema(  //define a schema...blueprint of users in mongodb database
    {
name:{
    type:String,
    required:[true,"Name is required"], //every user must provide the name...the messsage willl show the field is missing
    trim:true,//remove nay extra spaces before and after the name...//that is helps to removing unncessary spaces ,avoiding formatting issues when storing or displaying names
},
email:{
     type:String,
     required:[true,"email is required"],
     unique:true,  //ensures that no two users can have the same email
     match:[/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,"please enter valid email address"], //the regex validation helps prevent incorecct emailformats and that validate every user has valid email for authentication    
},

password:{
    type:String,
    required:[true,"password is required"],//thats validatio..ensures that user must enter a password
    minlength:[6,"password must be 6 characters"],

},

role:{
    type:[String],//assign for multiple role for one user
    enum: ["Admin", "Veterinarian", "Receptionist", "Pet Owner"],
    
    default:"Pet Owner" //is a user dosent specially mention his role asigned him to user...

},




 // Add a permissions array to store specific permissions
 permissions: {
    type: [String],
    default: []
  },

phonenumber: { type: String, required: true, unique: true,sparse: true },


isActive:{
    type:Boolean,  //boolean field to track wheter user is active or not
    default:true,   //by default every newly created user is active..//this allows admins to disable user accounts if needed

},

isVerified: {
            type: Boolean,
            default: false // Default is false until the user verifies their email
        },


        profilePicture: { type: String }, // Store image URL
        specialization: { type: String }, // Only for Veterinarians
        licenseNumber: { type: String }, // Only for Veterinarians
        pets: [
          {
            name: String,
            species: String,
            breed: String,
            age: Number,
            medicalHistory: String,
          },
        ],





otp: {
            type: String // Stores OTP temporarily for verification
        },
        otpExpires: {
            type: Date // Stores expiration time for OTP (e.g., 10 minutes)
        },

createdAt:{
    type:Date,   //stores the data and time the user was created
    default:Date.now, //utomatically sets the current date and time when a user is added //useful for logging and auditing
},

 // Track role history for audit purposes
 roleHistory: [
    {
      previousRole: String,
      newRole: String,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]

    },
    {timestamps:true} 
    
    //automatically adds createdAt and updatedAt timestamps//akes it easy to track when users created or updated
);
//hash password before saving to db..

// **Hash password before saving to DB**
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  // **Compare entered password with hashed password in DB**
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  module.exports=mongoose.model("User",userSchema); //creates a mongoose model from userSchema now it can allow other files
   */