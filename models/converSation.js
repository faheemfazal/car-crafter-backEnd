import mongoose from "mongoose";

const converSationSchema = new mongoose.Schema({
    members:{
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }],
    }
},{
    timestamps:true
})

const converSation = mongoose.model('converSation',converSationSchema)

export default converSation;