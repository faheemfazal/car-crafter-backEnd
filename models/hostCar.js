import mongoose from "mongoose";

const hostCarSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
  
        year:{
            type:Number,
            required:true,
        },
        fual:{
            type:String,
            required:true,
            
        },
        email:{
            type:String,
            required:true,
            
        },
        description:{
            type:String,
            required:true
        },
        noOwner:{
            type:String,
            required:true
        },
        transmission:{
            type:String,
            required:true
        },
        status:{
            type:String,
            default:"pending"
        },
        brand:{
            type:String,
            required:true
        },
        features:{
            type:String,
            required:true
        },
        price:{
           type:Number,
           required:true
        },
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        neighbourhood:{
            type:String,
            required:true
        },
        
        sNumber:{
            type:String,
            required:true
        },
        imageRC:{
            type:Array,
            required:true
        },
        imageIC:{
            type:Array,
            required:true
        },
        imageCar:{
            type:Array,
            required:true
        },
        km:{
            type:Number,
            required:true,
        },
        carNumber:{
            type:String,
            require:true,
            unique:true,
        },
        selectedDate: {
            type: Date,
            default:new Date()
        },


    },{
        timestamps:true
    })

const CarDb = mongoose.model('CarDb',hostCarSchema)

export default CarDb;
