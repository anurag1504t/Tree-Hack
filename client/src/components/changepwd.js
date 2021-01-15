import React,{useState} from 'react'
import {serverurl} from '../config'
import {useHistory} from 'react-router-dom'
import confirm from "reactstrap-confirm";
import "../stylesheet/changepwd.css";
import Loading from './loading'

const Pwdchange= ()=>{
    const [loading, setloading] = useState(true);
   const [msg,setmsg]=useState("")
   const [pass,setpass]=useState("")
   const [newpass,setnewpass]=useState("")
   const [newpass2,setnewpass2]=useState("")
    const history=useHistory()

const passchanged=async()=>{
    let result = await confirm(
        {
            title: ( "dear user"),
            message: "your password has changed successfully",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: ""
        }
    ); 
    history.push('/profile')
}

const submitpwd=()=>{
    setmsg("")
    if(newpass!=newpass2){
        setmsg("password do not match");return false
    }
    if(newpass.length<6){
        setmsg("password length should me atleast 6");return false
    }
    setloading(false)
    fetch(serverurl+"/users/changepwd",{
        method:"post",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
            pass,
            newpass
        })
    }).then(res=>res.json())
    .then(data=>{
        setloading(true)
        if(data.err){
            setmsg(data.err)
            setmsg("error changing password")
        }
        else{
            passchanged()
        }
        setnewpass2("")
        setnewpass("")
        setpass("")

    }).catch(err=>{
        setloading(true);
        setmsg("error changing password")
    })
}
   
return(

    <div className='changepwd-main container'>
        <div className='alert alert-primary' style={{textAlign:'center'}}>{msg}</div>
        {loading?
            <div className='changepwd-inside'>
            <div className="changepwd-main">
                <h1>Password Reset</h1>
                <span>Use Current Password</span><span>to reset password</span>
            </div>
            <br></br>
            <div><input type='password' value={pass} onChange={(e)=>setpass(e.target.value)} placeholder='old password' /></div>
            <div><input type='password' minlength="6" maxLength="20"  value={newpass} onChange={(e)=>setnewpass(e.target.value)} placeholder='new password' /></div>
            <div><input type='password' minlength="6" maxLength="20"  value={newpass2} onChange={(e)=>setnewpass2(e.target.value)} placeholder='re-enter new password' /></div>
            <div><button className="changepwd-button" onClick={()=>submitpwd()}>submit</button></div>
         </div>:
         <Loading />
        }
    </div>

)

}

export default Pwdchange