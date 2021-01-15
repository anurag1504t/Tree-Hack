import React, { useState, useEffect} from "react";
import {serverurl} from "../config";
import { useParams } from "react-router-dom";
import "../stylesheet/final.css";
import Loading from "./loading";

const Final= ()=>{

   const [data,setdata]=useState({})
   const [loading,setloading]=useState(false)
   const [msg,setmsg]=useState("")
   const {id}=useParams()

   useEffect(()=>{
      fetch(`${serverurl}/orders/getorderdetails`,{
         method:"post",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         },
         body:JSON.stringify({
            orderid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         setloading(true)
          if(result.err){
            setmsg("error loading")
          }else{
            setdata(result)
          }
      }).catch(err=>{
         setloading(true)
         setmsg("error loading")
      })
   },[])

   const convert=(i)=>{
      var c=""
      if(i<12) c="AM"
      else{c="PM";if(i>12) i=i-12;}
      if(i==0.5) return "12.30-1.00 PM"
   if(i*10%10==0){
      return Math.floor(i)+".00-"+(Math.floor(i))+".30"+c
   }else{
      return Math.floor(i)+".30-"+(Math.floor(i)+1)+".00"+c
   }
   }

return(

   <div className='main-final'>
      <div className='alert alert-primary' style={{textAlign:'center'}}>{msg}</div>
      <div><h1>your order is placed successfully</h1></div>
      <br></br>
      <div><h6>Your order reference number is {id}. Thank you for Shopping with Us. </h6></div>
      <br></br>
   </div>

)

}

export default Final