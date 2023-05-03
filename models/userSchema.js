import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true,
        max:50,
    },
    password:{ 
        type:String,
        required:true,
        min:5
    },
    number:{
        type:Number,
        required:true,
        min:10
    },
    isAdimin:{
        type:Boolean,
        default:false
    },
    wallet:{
        type:Number,
        default:0
    },
    bankAccount:{
        accountNumber:{
            type:String,
        },
        branch: {
            type:String,
        },
        ifscCode: {
            type:String,
        },
        accoundHolder:{
            type:String,
        }
    },
    profile:{
        drivingLicense:{
            type:Array,
            required:true
        },
        identitycard:{
            type:Array,
            required:true
        }
    },
    access:{
        type:Boolean,
        default:true
    },
},{ 
    timestamps:true
})

const User = mongoose.model('User',userSchema)

export default User