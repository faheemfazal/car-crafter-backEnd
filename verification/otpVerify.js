import Twilio from 'twilio';
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
// const cliend = require('twilio')

const accountSid = process.env.SID
const authToken = process.env.TOKEN
const verifySid = process.env.SSID
const client = Twilio(accountSid, authToken);

export function sendOtp(number){
    client.verify.v2.services(verifySid)
    .verifications.create({ to:`+91${number}`, channel: "sms" })
    .then((res)=>console.log(res.status));   
}


export function verifyOtp(number,otp){
    return new  Promise((resolve,reject)=>{
        client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91${number}`, code: otp })
         .then((verification_check) => {console.log(verification_check.status)
         resolve(verification_check)})
         
        })
}