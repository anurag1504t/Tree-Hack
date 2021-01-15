import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import DatePicker from 'react-date-picker'
import TimeslotNav from '../timeslotnav'
import Loading from '../loading'
import confirm from "reactstrap-confirm";

const WindowBookingTime= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState({})
   const [msg,setmsg]=useState("")
   const [date,setdate]=useState(new Date())
   const [loading,setloading]=useState(false)
   useEffect(()=>{
    getdate()
   },[])
   useEffect(()=>{
    updatelist()
   },[data])

const getdate=()=>{
    setmsg("")
    setloading(false)
    fetch(`${serverurl}/timeslot/getwindowslot`,{
        method:"post",
        headers:{
           "Content-Type":"application/json"
        },
        body:JSON.stringify({
           date:date.toDateString()
        })
     }).then(res=>res.json())
     .then(result=>{
         if(result.err) setmsg("error loading")
         else setdata(result.arr)
     }).catch(err=>{
        setloading(true)
         setmsg("error loading")
     })
}

const setslot=async()=>{
    setmsg("")
    let result = await confirm(
        {
            title: ( "dear admin"),
            message: "do you really want to set this slot?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false
    else setloading(false)
    
    var arr=[]
    for(var i=8.5;i<18;i=i+0.5){
        if(list[i]==true) arr.push(i)
    }
    fetch(`${serverurl}/timeslot/setwindowslot`,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           date:date.toDateString(),arr:arr
        })
     }).then(res=>res.json())
     .then(async result=>{
        
        if(result.err) setmsg("error setting slot")
        else{
            setmsg("slot setted successfully")
            let result = await confirm(
                {
                    title: ( "dear admin"),
                    message: "slot setted successfully for "+date.toString(),
                    confirmText: "ok",
                    confirmColor: "primary",
                    cancelText: ""
                }
            ); 
        }
        setloading(true)
        }).catch(err=>{
        setloading(true)
        setmsg("error setting slot")
     })
}

const updatelist=()=>{
    var a={}
    for(var i=8.5;i<18;i=i+0.5){
        a[i]=false;
    }
    for(var i=0;i<data.length;i++){
        a[data[i]]=true
    }
    setlist(a);
    setloading(true)

}
const toggle=(d)=>{
    var a={}
    for(var i=8.5;i<18;i=i+0.5){
        if(i!=d)
        a[i]=list[i];
        else{
            a[i]=list[i]?false:true;
        }
    }
    setlist(a)
}

return(
   <div className='main'>
       <TimeslotNav />
   <div class='headt'> slot booking time </div>
       <div>{msg}</div>
       <DatePicker value={date} format="y-MM-dd" minDate={new Date()} onChange={(dt)=>setdate(dt)} />
       <button onClick={()=>getdate()}>check</button>

    {
        list&&loading?
        <div>
            <div onClick={(e)=>toggle(8.5)} className={list[8.5]?"selected":"notselected"}>8.30-9.00 PM</div>
            <div onClick={(e)=>toggle(9)} className={list[9]?"selected":"notselected"}>9.00-9.30 PM</div>
            <div onClick={(e)=>toggle(9.5)} className={list[9.5]?"selected":"notselected"}>9.30-10.00 PM</div>
            <div onClick={(e)=>toggle(10)} className={list[10]?"selected":"notselected"}>10.00-10.30 PM</div>
            <div onClick={(e)=>toggle(10.5)} className={list[10.5]?"selected":"notselected"}>10.30-11.00 PM</div>
            <div onClick={(e)=>toggle(11)} className={list[11]?"selected":"notselected"}>11.00-11.30 PM</div>
            <div onClick={(e)=>toggle(11.5)} className={list[11.5]?"selected":"notselected"}>11.30-12.00 PM</div>
            <div onClick={(e)=>toggle(12)} className={list[12]?"selected":"notselected"}>12.00-12.30 PM</div>
            <div onClick={(e)=>toggle(12.5)} className={list[12.5]?"selected":"notselected"}>12.30-01.00 PM</div>
            <div onClick={(e)=>toggle(13)} className={list[13]?"selected":"notselected"}>1.00-1.30 PM</div>
            <div onClick={(e)=>toggle(13.5)} className={list[13.5]?"selected":"notselected"}>1.30-2.00 PM</div>
            <div onClick={(e)=>toggle(14)} className={list[14]?"selected":"notselected"}>2.00-2.30 PM</div>
            <div onClick={(e)=>toggle(14.5)} className={list[14.5]?"selected":"notselected"}>2.30-3.00 PM</div>
            <div onClick={(e)=>toggle(15)} className={list[15]?"selected":"notselected"}>3.00-3.30 PM</div>
            <div onClick={(e)=>toggle(15.5)} className={list[15.5]?"selected":"notselected"}>3.30-4.00 PM</div>
            <div onClick={(e)=>toggle(16)} className={list[16]?"selected":"notselected"}>4.00-4.30 PM</div>
            <div onClick={(e)=>toggle(16.5)} className={list[16.5]?"selected":"notselected"}>4.30-5.00 PM</div>
            <div onClick={(e)=>toggle(17)} className={list[17]?"selected":"notselected"}>5.00-5.30 PM</div>
            <div onClick={(e)=>toggle(17.5)} className={list[17.5]?"selected":"notselected"}>5.30-6.00 PM</div>
            <div><button onClick={()=>setslot()}>submit</button></div>
        </div>:
        <Loading />
    }
   </div>

)

}

export default WindowBookingTime