import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../models/userSchema.js'
import {sendOtp,verifyOtp} from '../../verification/otpVerify.js'


export const login =async (req,res)=>{
    try{
       const user =await User.findOne({number:req.body.number})
       console.log(req.body);
       let data;
       if(user){
        data={
          email:user.email,
          name:user.name,
          id:user._id   
        }
        sendOtp(req.body.number)   
        res.status(200).json({message:"VerifyOtp"})
      }else{
        console.log("fgdf");
         res.status(201).json({mesaage:"user illa",number:req.body.number})


       }
    }catch (err){
      console.log(err);

      
    } 
}



export const signup=async(req,res)=>{
  try{  
     console.log(req.body);
     const user= await User.findOne({email:req.body.email})
     console.log(user);
     let data;

     if(user){
      console.log("rthgfhfdg");
      res.status(204).json({message:"Email Already Exist"})
     }else{
       const password = bcrypt.hashSync(req.body.password, 10 )
       console.log(password); 
       Object.assign(req.body,{password}) 
        const user =  await User.create(req.body) 
        console.log(user);
        const name = user.name
        const email = user.email
        const id = user._id
        const number = user.number
        const token =jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:86400})
        res.status(200).json({auth:true,name:name,email:email,id:id,number:number,message:"Login success",token})
     }
  }catch(e){
     console.log(e);
  }
}

export const otpVerify = async (req,res)=>{
  try{
    let data; 
    // const type = typeof(req.body.otp)
    console.log(req.body);
    // console.log(type,'..................');
    if(req.body.open){
      console.log('open');
      const user = await User.findOne({ number: req.body.number });
      console.log(user);
        
  
      if (user) {

        const data = await bcrypt.compare(req.body.otp, user.password);
        console.log(data);
        if (data) {
          const name = user.name 
          const email = user.email
          const id = user._id
          console.log(id);
          const number = user.number
          const token =jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:86400})
          res.status(200).json({auth:true,name,email,id,number,message:"Login success",token})
      }
    }else{
      res.status(204).json({message:"Incorrect Password"})
    }
      
    }else{

      console.log(req.body); 
      verifyOtp(req.body.number, req.body.otp).then(async(response)=>{
        if(response.status == 'approved'){
          const user = await User.findOne({number:req.body.number})
          const name = user.name 
          const email = user.email
          const id = user._id
          console.log(id);
          const number = user.number
          const token =jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:86400})
          res.status(200).json({auth:true,name:name,email:email,id:id,number:number,message:"Login success",token})
        }else{
          res.status(204).json({message:"Incorrect Otp"})
        }
      }).catch(()=>res.status(204).json({message:"Incorrect Otp"}))
    }

  }catch(err){
    
  }
}





