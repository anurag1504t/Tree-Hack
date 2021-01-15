import React,{useState,useEffect} from 'react'
import {serverurl} from '../config'
import {useHistory, useParams} from 'react-router-dom'
import DatePicker from 'react-date-picker'
import Loading from './loading'
import "../stylesheet/checkout.css";
import confirm from "reactstrap-confirm";

const Changeslot= ()=>{

   const [data,setdata]=useState([])
   const [date,setdate]=useState()
   const [dateshow,setdateshow]=useState()
   const [loading,setloading]=useState(false)
   const [time,settime]=useState("")
   const history=useHistory()
   const [msg,setmsg]=useState("")
   const {oid}=useParams()

   useEffect(() => {
      fetch(serverurl+'/sys/getuserinfo',{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
         if(!result.data.usershop){
            history.push('/info/shrestrict')
         }
         else if(!result.data.shop){
            history.push('info/shclose')
         }
         else{
            setloading(true)
         }
      }).catch(err=>{
         history.push('/')
      })
   },[])

const getmindate=()=>{
   let dt=new Date();
   dt.setDate(dt.getDate()+1);
   return dt;
}

const getdate=()=>{
   settime("")
   if(!date){
      setmsg("choose date")
      return false
   }else{
      setmsg("")
   }
   setloading(false)

   fetch(`${serverurl}/timeslot/getpickupslotuser`,{
      method:"post",
      headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      },
      body:JSON.stringify({
         date:date.toDateString()
      })
   }).then(res=>res.json())
   .then(result=>{
      if(result.err) setmsg("error loading")
      else{
         setdata(result.timeslot)
       if(result.timeslot[0]){
         settime(result.timeslot[0]._id)
      }
      }
      setdateshow(date)
      setloading(true)
   }).catch(err=>{
      setloading(true)
      setmsg("error loading")
   })
} 

const submitorder=async ()=>{
   if(!time) return 0;
   if(!date){
      setmsg("choose date")
      return false
   }else{
      setmsg("")
   }
   let result = await confirm(
      {
          title: ( "dear user"),
          message: "are you sure, you want to change pickup slot?",
          confirmText: "ok",
          confirmColor: "primary",
          cancelText: "cancel"
      }
  ); 
  if(result==false) return false;
  else setloading(false)

   fetch(`${serverurl}/orders/changetimeslot`,{
      method:"post",
      headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      },
      body:JSON.stringify({
          orderid:oid,
         timeslotid:time
      })
   }).then(res=>res.json())
   .then(result=>{
       if(!result.err)
       history.push(`/final/${result.id}`)
       else{
       setmsg("error changing timeslot")
       settime("")
      }
   }).catch(err=>{
      setloading(true)
      setmsg("error changing timeslot")
      settime("")
   })
}

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

   <div className='main-checkout'>
      <h1>Select a time slot to pick order</h1>
      <br></br>
      <div className='alert alert-primary' style={{textAlign:'center'}}>{msg}</div>
      {loading?<div className="timeslot-checkout-container">
      
  <DatePicker value={date} minDate={getmindate()} onChange={(dt)=>setdate(dt)} />
       <button className='checkout-button' onClick={()=>getdate()}>check</button>
<div className='sel'>{dateshow?dateshow.toDateString():""}</div>
      {data.length!=0? <select className='sel' value={time} onChange={(e)=>settime(e.target.value)}>
          {
             data?
             data.map(item=>{
                return(
                <option value={item._id}>{convert(item.start)}</option>
                )
             })
             :<option></option>
          }
       </select>:<div></div>
         }
       {data.length==0&&loading?<div>no slot availaible on this date</div>:<div></div>}
      {time?<button className='checkout-button' onClick={()=>{submitorder()}}>place order</button>:<span></span>}
      </div>:<Loading />
}
            <br></br>
            <br></br>
            <br></br>
   </div>

)

}

export default Changeslot