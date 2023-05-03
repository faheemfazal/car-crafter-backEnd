import CarDb from '../../models/hostCar.js';
import Cardb from '../../models/hostCar.js'
import LocationDb from '../../models/locatin.js';
import userDb from '../../models/userSchema.js'
import orderDb from '../../models/orderSchema.js'
import messageDb from '../../models/messageSchema.js'


export const hostData = async(req,res)=>{
    try{
        console.log(req.body);
        const data =req.body
        const exist = await Cardb.findOne({carNumber:req.body.carNumber})
        console.log(exist);
        if(exist){
            console.log('kkkk');
            res.status(400).json({message:'already stored'})
            
        }else{

            console.log('nouser',);
            console.log(req.body.id);
            Object.assign(req.body)
            const car  = await Cardb.create(req.body)
            res.status(201).json({car,message:'Success'}) 
        }

        
 
    }catch(e){
      console.log(e);
    }
}

export const getLocation = async(req,res)=>{
    try{
        console.log("dddd");
        const city = await LocationDb.find({},{city:1}).sort({city:1})
        console.log(city);
        res.status(201).json({city})
    }catch(e){
        console.log(e);
    }
}

export const hostList = async (req,res)=>{
    try{
        console.log('hhhhhhhfffhhhhhh');
        console.log(req.query);
        const Approved = await Cardb.find({owner:req.query.id,status:'Approved'})
        console.log(Approved);
        const Orders = await orderDb.find({userData:req.query.id}).populate('carData')
        console.log(Orders);
        res.status(201).json({Approved,Orders})
    }catch(err){
        console.log(err);

    }
}

export const postAccountdetails = async (req,res)=>{
    try{
        console.log(req.body);
      const newAccount =   await userDb.findOneAndUpdate({_id:req.body.id},{
            bankAccount:req.body
        }, {upsert: true},{new: true})
        console.log(newAccount);
        res.status(201).json({newAccount:newAccount})

    }catch(e){
        console.log(e);
    }
} 

export const getAccount  = async (req,res)=>{
    try{
        console.log(req.query);
       const oldAccount = await userDb.findOne({_id:req.query.id,bankAccount:{$exists :true} })
       console.log(oldAccount);
       if(oldAccount){
          res.status(201).json({oldAccount})
       }else{
          res.status(502)
       }
    }catch{

    }
}

export const addMesssage =async (req,res)=>{
    try{

        console.log(req.body);
        const {from,to,message} = req.body
        const data = await messageDb.create({
               message:{text:message},
               users:{from,to},
               sender:from,
        })
        if(data) return res.status(201).json({msg:'Message added successfully'})
        return res.json({msg:'faild to add message in datebase'})
    }
    catch(e){
        console.log(e);

    }
}


export const completeOrder = async (req,res)=>{
    try{
        console.log(req.body);
       const data =   await orderDb.findOneAndUpdate({_id:req.body.orderId},{orderStatus:'complete'},{new:true})
            console.log(data);
            res.status(201).json({data})

            if(data) return res.status(201).json({data})
            return res.json({})


        
    }catch(e){

    }
    
}

export const checkAcc =async (req,res)=>{
   try{
    console.log(req.query);
    const user = await userDb.findOne({_id:req.query.userId,bankAccount:{$exists:true}})

    console.log(user);
    if(user) return res.status(201).json({user})
    return res.status(501).json()
   }catch{

   }
}