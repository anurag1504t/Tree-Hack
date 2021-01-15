import React,{useEffect} from 'react'
import {useHistory} from 'react-router-dom'
const Def= ()=>{

   const history=useHistory()
   useEffect(() => {
       history.push('/')
   }, [history])

return(
    <div className='main'>
        NO such Page Present
    </div>
)
}

export default Def