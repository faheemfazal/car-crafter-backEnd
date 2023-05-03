
import express from 'express'
import {login,signup,otpVerify} from '../controllers/auth/auth.controller.js'
import {hostData,getLocation,hostList,postAccountdetails,getAccount,addMesssage,completeOrder,checkAcc} from '../controllers/hostUser/user.controller.js'
import { getsutableLocation,getfindCar,findDate,getcarDetails,createOrder,updateProfile,orderDetails,cancelOrder,expandDate,createChat,getChatList,createMessage,getOldMessage,postProfile,checkprofile } from '../controllers/rentUser/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'


const router = express.Router()

 
router.post('/number',login)
router.post('/signup',signup) 
router.post('/otp',otpVerify)
router.post('/hostdata',hostData)
router.get('/landinglocation',getLocation)
router.get('/findlocation',getsutableLocation)
router.get('/findCar',getfindCar) 
router.get('/getdate',findDate)
router.get('/getcar',getcarDetails)
router.post('/createOrder',createOrder)
router.post('/updateprofile',verifyToken,updateProfile)
router.get('/getOrderForUser',verifyToken,orderDetails)
router.post('/cancelOrder',verifyToken,cancelOrder)
router.post('/updateExpandDate',verifyToken,expandDate)
router.get('/gethostList',verifyToken,hostList)
router.post('/postAccounntDetails',verifyToken,postAccountdetails)
router.get('/getAccount',verifyToken,getAccount)
router.post('/sendMessage',verifyToken,addMesssage )
router.post('/createChat',verifyToken,createChat)
router.get('/getChatList',verifyToken,getChatList)
router.post('/sentMessage',verifyToken,createMessage)
router.get('/getOldMessage',verifyToken,getOldMessage)
router.post('/setCompleteOrder',verifyToken,completeOrder)
router.post('/postProfile',verifyToken,postProfile)
router.get('/checkprofile',verifyToken,checkprofile)
router.get('/checkAcc',verifyToken,checkAcc)








export default router;