
import React,{ useState ,useContext  } from "react";
import {Link} from "react-router-dom";
import { useHistory } from "react-router-dom";
import {usercontext} from "../App";
import {serverurl} from "../config";
import "../stylesheet/login.css";
import confirm from "reactstrap-confirm";


import Loading from "./loading";

const Login= ()=>{
    const{state,dispatch}=useContext(usercontext)
    const history=useHistory()
    const [username,setuid]=useState("")
    const [password,setpassword]=useState("")
    const [msg,setmsg]=useState("")
    const [loading, setloading] = useState(true);


    const postdata= ()=> {

        setloading(false)
        setmsg("")
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
            setloading(true)
            if(data.err){
                setmsg(data.err.message)
            }
            else{
                let dt=new Date();
                dt.setDate(dt.getDate()+10);
                dt=dt.toString();
                localStorage.setItem("token",data.token)
                localStorage.setItem("tokendate",dt)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                history.push('/')
                
            }
        }).catch(err=>{
            setmsg("error login")
            setloading(true)
        })
    }

    const forgetpwd = async () => {
        let result = await confirm(
            {
                title: ( "forgot password"),
                message: "contact admin to reset your password",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: ""
            }
        ); 
        setloading(true)
    }

    return(
        <div className="container main-login">
            {loading?
            <div className='inside'>
                <div>
                    <h1>Sign in</h1>
                    <span>to use your account</span>
                </div>
                <div className="main-login">                    
                    <div className='message'>{msg}</div>
                    <div><input className="col-12" type='text' placeholder='Username' value={username} onChange={(e)=>setuid(e.target.value)} /></div> 
                    <div><input className="col-12" type='password' placeholder='Password' value={password} onChange={(e)=>setpassword(e.target.value)} /></div> 
                    <a href="#" onClick={() => forgetpwd()}>Forgot your password?</a>
                    <button className="login-button" onClick={()=>postdata()}> login</button>
                    <p>Not Registered yet?
                        <br></br>Apply for Registration</p>
                    <Link to="/signup"><button className="login-button"> Register</button></Link>
                </div>
            </div>:<Loading />
}
        </div>
    )
}

export default Login