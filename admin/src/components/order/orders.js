import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import DatePicker from 'react-date-picker'
import confirm from "reactstrap-confirm";

import OrderNav from '../ordernav'
import Loading from '../loading'
const Orders= ()=>{

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

const searchall=()=>{
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
            url='/orders/allorders'
    }else{
        url='/orders/searchdate'
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
      else{
        setdata(result.orders)
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

    const cancelorder=async(id)=>{
       setmsg("")
      let result = await confirm(
         {
             title: ( "dear admin"),
             message: "do you really want to cancel this order?",
             confirmText: "ok",
             confirmColor: "primary",
             cancelText: "cancel"
         }
     ); 
     if(result==false) return false
        fetch(`${serverurl}/orders/cancelorder/${id}`,{
            method:"delete",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("token")
            }
         }).then(res=>res.json())
         .then(async result=>{
             
             if(result.err) setmsg("error cancelling order")
             else{
               let resultt = await confirm(
                  {
                      title: ( "dear admin"),
                      message: "order is cancelled",
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
            setmsg("error cancelling order")
         })
    }

    const completeorder=async(id)=>{
      setmsg("")
      let result = await confirm(
         {
             title: ( "dear admin"),
             message: "do you really want to mark this order as completed?",
             confirmText: "ok",
             confirmColor: "primary",
             cancelText: "cancel"
         }
     ); 
     if(result==false) return false
        fetch(`${serverurl}/orders/${id}`,{
            method:"delete",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("token")
            }
         }).then(res=>res.json())
         .then(async result=>{
             if(result.err) setmsg("error completing order")
             else{
               let resultt = await confirm(
                  {
                      title: ( "dear admin"),
                      message: "order is marked as completed",
                      confirmText: "ok",
                      confirmColor: "primary",
                      cancelText: ""
                  }
              ); 
             let d=data.filter(item=>{return item._id!=id})
             setdata(d)
             setmsg("order set completed")
             }
         }).catch(err=>{
            setmsg("error completing order")
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
   <div class='headt'>  orders </div>
       <div>{msg}</div>
       <div>
          <button onClick={()=>searchall()}>all orders</button>
       <DatePicker value={date} format="y-MM-dd" minDate={new Date()} onChange={(dt)=>setdate(dt)} />
       <button onClick={()=>searchdate()}>check</button>
       </div>
<div className='list'>
    {
        data&&loading?
        data.map(item=>{
            return(
            <div className='product2'><Link to={`/orderdetail/${item._id}`} className='ll'>
                <div>buyer name: {item.buyer.name}</div>
                <div className='timeslot'>
              <div className='tm'>timeSlot details</div>
              {item.timeSlot.date!=0?<div>
               <div>{item.timeSlot.date}</div>
               <div>{convert(item.timeSlot.start)}</div>
               </div>:<div>you cancelled this timeslot</div>}
               </div>
               </Link>
                <div><button onClick={()=>{completeorder(item._id)}}>completed</button></div>
                <div><button onClick={()=>{cancelorder(item._id)}}>cancel</button></div>
            </div>
            )
        }):
           <Loading />
    }</div>
    {
       data.length==0&&loading?
       <div>no orders found</div>:
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

export default Orders