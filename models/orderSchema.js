import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    carData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarDb"
    },
    amount:{
        type:Number,
        required:true,
    },
    protectionPackage:{
        type:Number,
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    userData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderStatus:{
        type:String,
        default:'pending'
    }
},{
    timestamps:true
})

const Order = mongoose.model('Orders',orderSchema)

export default Order
