import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import OrderNav from '../ordernav'
import DatePicker from 'react-date-picker'
import Loading from '../loading'
import confirm from "reactstrap-confirm";

const SlotBooked= ()=>{

   const [data,setdata]=useState([])

   const [msg,setmsg]=useState("")

   const [date,setdate]=useState(new Date())
   const [page,setpage]=useState(1)
   const [loading,setloading]=useState(false)
   const [pages,setpages]=useState([1])
   const [pagenum,setpagenum]=useState(1)
   const [prod,setprod]=useState({type:'all',value:'all'})
   

  useEffect(() => {
      getresult(1)
  }, [prod])

const searchall=(quer)=>{
      let d={type:'all',value:"all"}
      setprod(d);
   }
const searchdate=()=>{
    let d={type:'search',value:date.toDateString()}
    setprod(d);
 }
 const getresult=(pg)=>{
    setloading(false)
    setmsg("")
     let url=''
    if(prod.type=='all'){
            url='/windoworders/allorders'
    }else{
        url='/windoworders/searchdate'
    }
    fetch(serverurl+url,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           query:prod.value,
           pgnum:pg
        })
     }).then(res=>res.json())
     .then(result=>{
      if(result.err) setmsg("error loading")
       else{ setdata(result.orders)
        setpage(pg)
        let l=pg-1>5?5:pg-1;
        let r=result.pages-pg>5?5:result.pages
        l=r<5?l+5-r:l;
        r=l<5?r+5-l:r;
      let d=[]
        for(var i=pg-l;i<=pg+r;i++){
           if(i<1) i=1;
           if(i>result.pages) break;
         d.push(i)
        }
        setpages(d)
        setpagenum(result.pages)
      }
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error loading")
     })
 }


    const removeorder=async (id)=>{

      setmsg("")
      let result = await confirm(
         {
             title: ( "dear admin"),
             message: "do you really want to remove this booking?",
             confirmText: "ok",
             confirmColor: "primary",
             cancelText: "cancel"
         }
     ); 
     if(result==false) return false
        fetch(`${serverurl}/windoworders/${id}`,{
            method:"delete",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("token")
            }
         }).then(res=>res.json())
         .then(async result=>{
             
             setmsg("")
             if(result.err) setmsg("error removing booking")
             else{
               let resultt = await confirm(
                  {
                      title: ( "dear admin"),
                      message: "booking is removed",
                      confirmText: "ok",
                      confirmColor: "primary",
                      cancelText: ""
                  }
              ); 
               setmsg("order cancelled successfully")
               let d=data.filter(item=>{return item._id!=id})
               setdata(d)
            }
         }).catch(err=>{
            setmsg("error completing booking")
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

   <div className='main'>
      <OrderNav />
   <div class='headt'> slots booked  </div>
   
       <div>{msg}</div>
       <DatePicker value={date} format="y-MM-dd" minDate={new Date()} onChange={(dt)=>setdate(dt)} />
       <button onClick={()=>searchdate()}>check</button>
<div className='list'>

    {
        data&&loading?
        data.map(item=>{
            return(
            <div className='product2'>
                <div>name: {item.buyer.name}</div>
                <div>username: {item.buyer.username}</div>
                <div className='timeslot'>
              <div className='tm'>timeSlot details</div>
               <div>{item.timeSlot.date}</div>
               <div>{convert(item.timeSlot.start)}</div>
               </div>
                <div><button className='redbutton' onClick={()=>{removeorder(item._id)}}>remove</button></div>

            </div>
            )
        }):
           <Loading />

    }   
    </div>
    {
       data.length==0&&loading?
       <div>no slot booking found</div>:
       <div></div>
    }
    <div>
            {
                pages?
                pages.map(item=>{
                    return(
                        <button disabled={item==page?true:false} onClick={()=>getresult(item)}>{item}</button>
                    )
                }):"loading"
            }
            <div>... total {pagenum} pages</div>
        </div>
   </div>

)

}

export default SlotBooked