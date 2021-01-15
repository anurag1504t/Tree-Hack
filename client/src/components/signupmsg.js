
import React from 'react'
import { useParams } from 'react-router-dom'
import '../stylesheet/signupmsg.css';



const Signupmsg= ()=>{
    const {name}=useParams()



return(

    <div className='main-signmsg'>
      <div>Dear { name}</div>
       <div>Your sign up request is posted successfully.</div>
       <div>It would be verified by the admin.</div>
    </div>


)

}

export default Signupmsg