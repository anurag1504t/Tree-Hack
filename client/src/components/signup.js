
import React,{ useState } from "react"
import { useHistory,Link } from "react-router-dom"
import {serverurl} from "../config"
import '../stylesheet/signup.css';
import Loading from './loading'

const Signup= ()=>{
    const history=useHistory()
    const [username,setuid]=useState("")
    const [password,setpassword]=useState("")
    const [email,setemail]=useState("")
    const [mobile,setmobile]=useState(null)
    const [repassword,setrepassword]=useState("")
    const [name,setname]=useState("")
    const [livein,setlivein]=useState(false)
    const [msg,setmsg]=useState("")
    const [loading, setloading] = useState(true);


    const validate=()=>{
        setmsg("")
        if(!password||!email||!name||!username||!mobile){
            setmsg("fill all the fields")
            return 0;
        }
        if(name.length<3){
            setmsg("enter correct name (greate than 3 alphabets)")
            return 0;
        }
        if(username.length<5){
            setmsg("choose correct username (greate than 5 alphabets)")
            return 0;
        }
        if(password.length<6){
            setmsg("minimum password length is 6")
            return 0;
        }
        if(password!=repassword){
            setmsg("password do not match")
            return 0;
        }
        if(mobile<6000000000||mobile>9999999999){
            setmsg("enter correct mobile number")
            return 0;
        }
        return 1
    }

    const submitform=(e)=>{
        setmsg("")
        e.preventDefault();
        if(!validate()) return 0;
        setloading(false)
        fetch(serverurl+"/usersrequests/req",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password,email,mobileNumber:mobile,
                name,livingIn:livein
            })
        }).then(res=>res.json())
        .then(data=>{
            setloading(true)
            if(data.err){
                setmsg("error. try changing username or email")
            }
            else{
                history.push(`/signupmsg/${data.name}`)
            }
            
        }).catch(err=>{
            setmsg("error signing up")
            setloading(true)
        })
    }


return(
    <div className="container main-signup">
        {loading?
        <div className='inside'>
            <div>
                <h1>Sign Up</h1>
                <span>request to create account</span>
            </div>
    <div className='main-signup'>
         <div className='message'>{msg}</div>
         <form onSubmit={(e)=>submitform(e)}>
       <div><input className="col-12" type='text' minlength="3" placeholder='Name' value={name} onChange={(e)=>setname(e.target.value)} /></div> 
       <div> <input className="col-12" type='email' placeholder='Email' value={email} onChange={(e)=>setemail(e.target.value)} /></div> 
       <div> <input className="col-12" type='tel' pattern="[0-9]{10}" minlength="10"  maxLength="10" placeholder='Mobile Number' value={mobile} onChange={(e)=>setmobile(e.target.value)} /></div> 
       <div>  <input className="col-12" type='text' minlength="5" maxLength="20" placeholder='Username' value={username} onChange={(e)=>setuid(e.target.value)} /></div> 
       <div><input className="col-12" type='password' minlength="6" maxLength="20" placeholder='Password' value={password} onChange={(e)=>setpassword(e.target.value)} /></div> 
       <div> <input className="col-12" type='password' minlength="6" maxLength="20" placeholder='Verify Password' value={repassword} onChange={(e)=>setrepassword(e.target.value)} /></div> 
        
       <div>  <input className="signup-button" type='submit' value='Register' /></div> 
       </form>
        <p>have an account?</p>
                    <Link to="/login"><button className="signup-button"> login</button></Link>
    </div>
    </div>:
    <Loading />
        }
    </div>

)

}

export default Signup