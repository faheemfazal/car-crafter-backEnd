import mongoose from "mongoose";


const profileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
  
    


},{
    timestamps:true
})

const profile = mongoose.model('Orders',profileSchema)

export default profile