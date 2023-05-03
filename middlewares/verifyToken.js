import jwt from 'jsonwebtoken'

export const verifyToken=async (req, res,next)=>{
    try{
      let header = req.headers.authorization;

      if(!header){
         res.status(401).send({error:'no token provider'})
      }
      console.log(header,'hh');
      const token = header.split(' ')[1]
      console.log(token);
      const verify = jwt.verify(token, process.env.JWT_SECRET,function(err,decoded){
        if(err){
          console.log('/////');
          res.status(500).send({error:"authentication failed"})
        }else{
          next()
        }
      })
    }catch(err){
      console.log(err);
    }
}



// bearer 
// token