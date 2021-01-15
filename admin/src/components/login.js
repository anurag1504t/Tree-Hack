
import React,{ useState ,useContext  } from 'react'
import { useHistory } from 'react-router-dom'
import {usercontext} from '../App'
import {serverurl} from '../config'
import '../stylesheet/style.css';
import Loading from './loading'

const Login= ()=>{
    const{state,dispatch}=useContext(usercontext)
    const history=useHistory()
    const [username,setuid]=useState("")
    const [password,setpassword]=useState("")
    const [msg,setmsg]=useState("")
    const [loading,setloading]=useState(true)

    const postdata=()=>{
        setloading(false)
        fetch(serverurl+"/users/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.err){
                setmsg(data.err.message)
                setloading(true)
            }
            else{
                let dt=new Date();
                dt.setDate(dt.getDate()+10);
                dt=dt.toString();
                localStorage.setItem("token",data.token)
                localStorage.setItem("tokendate",dt)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                setloading(true)

                history.push('/')
            }
        })
    }

return(

    <div className='main'>
        {loading?<div>
    <div class='headt'>admin login </div>
        <div className='message'>{msg}</div>
         <div><input type='text' placeholder='unique id' value={username} onChange={(e)=>setuid(e.target.value)} /></div>
         <div><input type='password' placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} /></div>
         <div><button onClick={()=>postdata()}>login</button></div>
         </div>
         :<Loading />
        }
    </div>


)

}

export default Login