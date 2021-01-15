import React,{useState,useEffect} from 'react'
import {serverurl} from '../config'
import {Link, useHistory} from 'react-router-dom'
import "../stylesheet/profile.css"
import ReactLoading from "react-loading";
import Loading from './loadingbar'
import confirm from "reactstrap-confirm";

import Officer from "../img/officer.jpg";


const Profile= ()=>{

   const [data,setdata]=useState([])
   const [pdata,setpdata]=useState({})

   const [loadingo,setloadingo]=useState(false)
   const [loadings,setloadings]=useState(false)
   const [loadingp,setloadingp]=useState(false)
    const history=useHistory()
   const [msg,setmsg]=useState("")
   const [slotdata,setslotdata]=useState([])


   useEffect(()=>{
      fetch(`${serverurl}/users/getuserdetails`,{
         method:"get",
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
          if(result.err) setmsg("error loading user details")
         else setpdata(result)
         setloadingp(true)
      }).catch(err=>{
         setmsg("error loading user details")
      })
   },[])

   useEffect(()=>{
      fetch(`${serverurl}/orders/getuserorders`,{
         method:"get",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         }
      }).then(res=>res.json())
      .then(result=>{
          if(result.err){
            setmsg("error loading orders")
          }else{
            setdata(result.orders)
          }
          setloadingo(true)
      }).catch(err=>{
         setmsg("error loading orders")
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
 const cancelorder=async (id)=>{
     setmsg("")
    let result = await confirm(
        {
            title: ( "dear user"),
            message: "are you sure, you want to cancel the order?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false;
    else{
        setloadingo(false)
    }
   fetch(`${serverurl}/orders/cancelorder/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        
        if(result.err) setmsg("error cancelling order")
        else {
            setmsg("order cancelled")
        let d=data.filter(item=>{return item._id!=id})
        setdata(d)
    }
        setloadingo(true)

    }).catch(err=>{
       setmsg("error cancelling order")
       setloadingo(true)

    })
}
const cancelslot=async (id)=>{
    setmsg("")

    let result = await confirm(
        {
            title: ( "dear user"),
            message: "are you sure, you want to cancel the booking?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false;
    else{
        setloadings(false)
    }
   fetch(`${serverurl}/windoworders/${id}`,{
       method:"delete",
       headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
       }
    }).then(res=>res.json())
    .then(result=>{
        
        if(result.err) setmsg("error cancelling booking")
        else {setmsg("booking cancelled")
        let d=slotdata.filter(item=>{return item._id!=id})
        setslotdata(d)}
        setloadings(true)
        
    }).catch(err=>{
       setmsg("error cancelling slot")
       setloadings(true)
    })
}
const changeslot=async (id)=>{
    setmsg("")

    let result = await confirm(
        {
            title: ( "dear user"),
            message: "are you sure, you want to change the slot?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false;
    else{
        history.push(`/changeslot/${id}`)
    }
    
}
return(

    <div className='main-profile'>
        <div className='alert' style={{textAlign:'center'}}>{msg}</div>
        <div className="row">
            <div className="user-details col-12 col-md-4 mb-4">
                {loadingp?
                    <div className="user-container">
                        <br></br>                        
                        <div className="user-container">                            
                            <div className='dd'>Hi, <em>{pdata.name}</em></div>
                            <br></br>
                            <span className="fa fa-user" height="200px"></span>
                            <div className='dd'>@{pdata.username}</div>
                            <div className='dd'><span className="fa fa-envelope"></span>  {pdata.email}</div>
                            <div className='dd'><span className="fa fa-phone"></span>  {pdata.mobileNumber}</div>
                        </div>
                        <div className='main-profile'>
                            <div className='rout2'><Link to='/changepwd'>change password</Link></div> 
                        </div>
                    </div>:
                    <ReactLoading
                        type="bars"
                        color="floralwhite"
                        height={667}
                        width={375}
                    />
                }
            </div>
            
            <div className="order col-12 col-md-8 mb-4">

                <div>
                    <div className='oh'>my orders</div>
                    {
                        loadingo?
                        <div>
                        <ul className="ul-order">
                            {data?
                            data.map((item, index) =>{
                                return(
                                    <li className='oi' key={index}>
                                        <div>
                                            <details className='det'>
                                            <summary>order item list</summary>
                                            
                                                <ul>
                                                    {                                                
                                                        item.items.filter(pro=>{return pro.quantity!=0}).map(prod=>{
                                                            return(
                                                                <li className='pi' key={prod.item._id}>{prod.item.name} - {prod.quantity}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            
                                            </details>
                                        </div>
                                        <div><button className="profile-button" onClick={()=>{cancelorder(item._id)}}>cancel</button></div>
                                    </li>
                                )
                            }):<div></div>
                            }
                        </ul>
                    </div>:
                    <div>
                        <Loading />
                        </div>
                    }
                    {
                       data.length==0&&loadingo?
                       <div>no orders found</div>:
                       <div></div>
                    }
                </div>

            </div>
        </div>
    </div>   
)

}

export default Profile