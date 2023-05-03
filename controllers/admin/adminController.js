import User from "../../models/userSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import Car from '../../models/hostCar.js'
import CarDb from "../../models/hostCar.js";
import LocationDb from "../../models/locatin.js";
import orderDb from '../../models/orderSchema.js'

 
export const adminLogin =async(req,res)=>{
    try{
        console.log(req.body);
        const admin =await User.findOne({email:req.body.email})
        console.log(admin);
        if(admin && admin.isAdimin){
            console.log(admin);
            await bcrypt.compare(req.body.password, admin.password, (err, data) => {
                if(err) throw err;
                else {

                    const name = admin.name 
                    const email = admin.email  
                    const token = jwt.sign({id:admin.id},process.env.JWT_SECRET,{expiresIn:86400})
                    res.status(200).json({admin:true,name,email,message:"Login success",token})
                }
            })

        }else{
            res.status(204).json({message:"check your userId"})
        }

    }catch{

    }
}
 
export const getHostData = async (req,res)=>{
    try{
       console.log("fgbsdh");
       const car =await CarDb.find({status:'pending'})
       console.log(car);
       if(car){
        res.status(200).json({message: "Success", car})
        }else{
            
        }

       

    }catch(e){
   console.log(e);
    }
} 

export const approveHost = async(req,res)=>{
    try{
      console.log(req.query);
      const car = await CarDb.updateOne({
        _id:req.query.id
      },{
        status:'Approved'
      })
      console.log(car);
      console.log("dfgdsgppppppp");
      res.status(200).json({message:'Rc approved'})
      
    }catch(e){

    }
}

export const denildHost = (req,res)=>{
    try{
      
    }catch(e){

    }
}

export const getVerifyData = async(req,res)=>{
    try{
        console.log(req.query.status);
        const car = await CarDb.find({status:req.query.status})
        console.log(car);
        res.status(200).json({message: "Success", car})
    }catch(e){
        console.log(e);
    }
}


export const getLocation = async (req,res)=>{
    try{
        console.log('oooooooooooo');
       const hostcityAndStateCode = await CarDb.aggregate([{$group:{_id:{state:"$state",city:"$city"}}}])
       console.log(hostcityAndStateCode);
       const oldLocation = await LocationDb.find()
       console.log(oldLocation);
       res.status(200).json({hostcityAndStateCode,oldLocation})
    }catch(e){
        console.log(e);
    }
}


export const createLocation= async(req,res)=>{
    try{
       console.log(req.body);
       const location = await LocationDb.findOne({state:req.body.state,city:req.body.city})
       console.log(location);
       if(location){
           res.status(400).json({message:"already created this city"})
           
    }else{
        await LocationDb.create(req.body).then((response)=>{
            
          res.status(200).json({message:' New Location Created'})
        })
       }
       
       
    }catch(e){

    }
}

export const deleteLocation = async (req,res)=>{
    try{
      console.log(req.query);
      await LocationDb.findByIdAndDelete(req.query.id).then((response)=>{

          res.status(201).json({message:'successfully deleted'})
      }).catch((er)=>{
        console.log(er);
        res.status(501).json({message:'somthing wrong'})
      })
    }catch(e){
       console.log(e);
    }
}

export const getOrderDetails = async (req,res)=>{
    try{
        console.log('dfgsd');
        const data = await orderDb.find({})
        console.log(data);
        res.status(201).json(data)
    }catch(e){

    }
}

export const getCompliteOrder = async(req,res)=>{
    try{
        console.log(';;;;;');
        const orders =  await orderDb.find({orderStatus:'complete'}) 
        console.log(orders);
        res.status(201).json({orders})
       

    }catch(e){

    }
}

export const getAcDetails = async(req,res )=>{
    try{
        console.log(req.query);
        const acDetail = await CarDb.findOne({_id:req.query.userId}).populate('owner')
        console.log(acDetail);
        if(acDetail) return res.status(201).json({account: acDetail.owner.bankAccount,amount:req.query.amount})
        return res.json({msg:'Create your account'})
        

    }catch(e){
        console.log(e);

    }
}

export const updatePayment = async (req,res)=>{
    try{
        console.log(req.body);
       const data =   await orderDb.findOneAndUpdate({_id:req.body.orderId},{orderStatus:'complete Payment'},{new:true})
            console.log(data);
            res.status(201).json({data})

            if(data) return res.status(201).json({data})
            return res.json({})


        
    }catch(e){

    }
    
}

export const getUserDetails = async (req,res)=>{
    try{
       
        const users = await User.find() 

        if(users) return res.status(201).json({users})
        return res.json({})
        
    }catch(e){

    }
    
}

export const blockUser = async (req,res)=>{
    try{
        console.log(req.query);
        await User.updateOne({_id:req.query.userId},{access:false}).then((response)=>{
            console.log(response);
            res.status(201).json()
        }).catch((err)=>{
            res.status(501).json()
        })

    }catch{

    }
}

export const UnblockUser = async (req,res)=>{
    try{
        console.log(req.query);
        await User.updateOne({_id:req.query.userId},{access:true}).then((response)=>{
            console.log(response);
            res.status(201).json()
        }).catch((err)=>{
            res.status(501).json()
        })

    }catch{

    }
}
const getMonthName = (monthNumber) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[monthNumber - 1]
}

export const getDashBord = async (req,res)=>{
    try {
        console.log('object')
        const profit = await orderDb.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    profit_count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
        console.log(profit);
        const result =  profit.map((report)=>{
            const month = getMonthName(report._id)
            report.month = month
            return report
        }) 
        const pending = await orderDb.find({ orderStatus: "pending" }).count()
        const complete = await orderDb.find({ orderStatus: "complete" }).count()
        const cancel = await orderDb.find({ orderStatus: "cancel" }).count()
        const completePayment = await orderDb.find({ orderStatus: "complete Payment" }).count()
        console.log(pending);
        let data =[];
        data.push(pending)
        data.push(complete)
        
        data.push(cancel)
        data.push(completePayment)

        
        res.status(200).json({result,data});
    } catch (err) {
        console.log(err);
        // res.status(500).json({ error:"internal server error" });
    }
}