import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import Loading from '../loading'
import confirm from "reactstrap-confirm";

const Sys= ()=>{

   const [data,setdata]=useState({})
   const [msg,setmsg]=useState("")
   const [slot,setslot]=useState(false)
   const [shop,setshop]=useState(false)
   const [loading,setloading]=useState(false)

    useEffect(()=>{
        fetch(serverurl+'/sys/',{
            method:"get"
         }).then(res=>res.json())
         .then(result=>{
             if(result.err) setmsg("error loading")
             else{
            setdata(result)
            console.log(result)
            setshop(result.data.shop)
            setslot(result.data.slot)}
            setloading(true)
         }).catch(err=>{
             setloading(true)
             setmsg("error loading")
         })
    },[])
    
    const toggleslot=()=>{
        if(slot){
            setslot(false)
        }else{
            setslot(true)
        }
    }
    const toggleshop=()=>{
        if(shop){
            setshop(false)
        }else{
            setshop(true)
        }
    }

const submitdata=async ()=>{
    setmsg("")
   let result = await confirm(
      {
          title: ( "dear admin"),
          message: "do you really want to change the status of the shop?",
          confirmText: "ok",
          confirmColor: "primary",
          cancelText: "cancel"
      }
  ); 
  if(result==false) return false
  else setloading(false)
    fetch(`${serverurl}/sys`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           shop:shop,slot:slot
        })
     }).then(res=>res.json())
     .then(async result=>{
        if(result.err) setmsg("error changing")
        else{
            setshop(result.d.shop)
            setslot(result.d.slot)
            let resultt = await confirm(
                {
                    title: ( "dear admin"),
                    message: "successfully changed status",
                    confirmText: "ok",
                    confirmColor: "primary",
                    cancelText: ""
                }
            ); 
            
        setmsg("successfully changed status")
        }
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error updating data")
     })
}

const deltimeslot=async ()=>{
    setmsg("")
    let result = await confirm(
       {
           title: ( "dear admin"),
           message: "do you really want to delete old timeslot data?",
           confirmText: "ok",
           confirmColor: "primary",
           cancelText: "cancel"
       }
   ); 
   if(result==false) return false
   else setloading(false)
     fetch(`${serverurl}/timeslot/deletetimeslots`,{
         method:"post",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         }
      }).then(res=>res.json())
      .then(async result=>{
         if(result.err) setmsg("error deleting data")
         else{
         setmsg("successfully deleted data")
         let resultt = await confirm(
            {
                title: ( "dear admin"),
                message: "successfully deleted old data",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: ""
            }
        ); 
         }
         
        setloading(true)
      }).catch(err=>{
         setloading(true)
         setmsg("error deleting data")
      })
}

return(

   <div className='main'>
       <div>{msg}</div>
       {
           data&&loading?
           <div>
                <div>slot booking <button onClick={()=>toggleslot()} className={slot?"greenbutton":"redbutton"}>{slot?"allowed":"not allowed"}</button></div>
    <div>online order <button onClick={()=>toggleshop()} className={shop?"greenbutton":"redbutton"}>{shop?"allowed":"not allowed"}</button></div>
    <div><button onClick={()=>submitdata()}>submit</button></div>

        <div><button onClick={()=>deltimeslot()}>delete old timeslots data</button></div>

            </div>:
            <Loading />
       }
   </div>

)

}

export default Sys