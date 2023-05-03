import express from 'express'
import {adminLogin,getHostData,approveHost,denildHost,getVerifyData,getLocation,createLocation,deleteLocation,getOrderDetails,getCompliteOrder,getAcDetails,updatePayment,getUserDetails,blockUser,UnblockUser,getDashBord} from '../controllers/admin/adminController.js'
import { verifyToken } from '../middlewares/verifyToken.js'


const router = express.Router()


router.post('/login',adminLogin)
router.get('/hostdata',verifyToken,getHostData)
router.get('/approve',verifyToken,approveHost)
router.get('/denied',verifyToken,denildHost)
router.get('/getStatusData',verifyToken,getVerifyData)
router.get('/findLocation',verifyToken,getLocation)
router.post('/postlocation',verifyToken,createLocation)
router.post('/locationDelete',verifyToken,deleteLocation)
router.get('/getorderData',verifyToken,getOrderDetails)
router.get('/getCompliteOrder',verifyToken,getCompliteOrder)
router.get('/getAccountdetails',verifyToken,getAcDetails)
router.post('/updatePaymentStatus',verifyToken,updatePayment)
router.get('/getUserDetails',verifyToken,getUserDetails)
router.post('/blockUser',verifyToken,blockUser)
router.post('/UnblockUser',verifyToken,UnblockUser)
router.get('/getDashBord',getDashBord)









export default router;  