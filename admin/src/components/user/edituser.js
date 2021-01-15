import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import { useParams,useHistory} from 'react-router-dom'
import Loading from '../loading'
import Usernav from '../usernav'
import confirm from "reactstrap-confirm";

const UserEdit= ()=>{

   const [data,setdata]=useState({})
   const [msg,setmsg]=useState("")
   const {username}=useParams()
   const [name,setname]=useState("")
   const [mobile,setmobile]=useState("")
   const [email,setemail]=useState("")
   const [live,setlivein]=useState(false)
   const [slot,setslot]=useState(false)
   const [shop,setshop]=useState(false)
   const [loading,setloading]=useState(false)
    const [pass,setpass]=useState("")
    const history=useHistory()
    useEffect(()=>{
        fetch(`${serverurl}/users/${username}`,{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
            if(result.err) setmsg("error loading")
             else{setdata(result)
            setname(result.name)
            setemail(result.email)
            setmobile(result.mobileNumber)
            setlivein(result.livingIn)
            setshop(result.shopping)
            setslot(result.slotbooking)
             }
            setloading(true)
         }).catch(err=>{
             setloading(true)
             setmsg("error loading")
         })
    },[])

const togglelive=()=>{
    if(live){
        setlivein(false)
    }else{
        setlivein(true)
    }
}
const toggleslot=()=>{
    if(slot){
        setslot(false)
    }else{
        setslot(true)
    }
}
const toggleorder=()=>{
    if(shop){
        setshop(false)
    }else{
        setshop(true)
    }
}

const edituser=async ()=>{
    setmsg("")
    let result = await confirm(
        {
            title: ( "dear admin"),
            message: "do you really want to change this user details?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false
    else setloading(false)
    fetch(`${serverurl}/users/${username}`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           name:name,email:email,mobileNumber:mobile,
           liveIn:live,slotbooking:slot,shopping:shop
        })
     }).then(res=>res.json())
     .then(async result=>{
        if(result.err) setmsg("error updating user")
        else {setmsg("user updated successfully")
        let result = await confirm(
            {
                title: ( "dear admin"),
                message: "user details are updated",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: ""
            }
        ); }
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error updating user")
     })
}

const deluser=async ()=>{
    setmsg("")
    let result = await confirm(
        {
            title: ( "dear admin"),
            message: "do you really want to delete this user?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false
    else setloading(false)
    fetch(`${serverurl}/users/${username}`,{
        method:"delete",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        }
     }).then(res=>res.json())
     .then(async (result)=>{
        if(result.err){setmsg("error deleting user")
        setloading(true)
        }else{
            let result = await confirm(
                {
                    title: ( "dear admin"),
                    message: "the user is deleted",
                    confirmText: "ok",
                    confirmColor: "primary",
                    cancelText: ""
                }
            ); 
            
            history.push('/userlist')
        }
     }).catch(err=>{
        setloading(true)
        setmsg("error deleting user")
     })
}
const resetpass=async()=>{
    setmsg("")
    if(pass.length<8){
        setmsg("password length should be 8")
        return false;
    }
    let result = await confirm(
        {
            title: ( "dear admin"),
            message: "do you really want to reset password of this user?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false
    else setloading(false)
    fetch(`${serverurl}/users/resetpwd`,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           username:username,pass:pass
        })
     }).then(res=>res.json())
     .then(async result=>{
        if(result.err) setmsg("error resetting password")
        else {setpass("")
        let result = await confirm(
            {
                title: ( "dear admin"),
                message: "password is resetted successfully",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: ""
            }
        );
        setmsg("password reset successfully") }
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error resetting password")
     })
}

return(

   <div className='main'>
   <Usernav />
<div class='headt'> edit user details </div>
       <div>{msg}</div>

    {
        data&&loading?<div>
            <div>name: <input value={name} onChange={(e)=>setname(e.target.value)} /></div>
            <div>email <input value={email} onChange={(e)=>setemail(e.target.value)} /></div>
            <div>mobile <input value={mobile} onChange={(e)=>setmobile(e.target.value)} /></div>
    <div><input type='text' value={pass} onChange={(e)=>setpass(e.target.value)} placeholder='reset password' />
    <button onClick={()=>resetpass()}>reset password</button>
    </div>
    <div><button onClick={()=>edituser()}>submit</button></div>
    <div><button className='redbutton' onClick={()=>{deluser()}}>delete user</button></div>
        </div>:
        <Loading />
    }
   </div>

)

}

export default UserEdit