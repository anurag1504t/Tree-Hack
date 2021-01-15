import React from 'react'
import { useParams} from 'react-router-dom'
import MaintenanceMessage from "./maintenance";
const Info= ()=>{

   const {code}=useParams()

const rendervalue=()=>{
    console.log(code)
    if(code=="shclose"){
        return (<MaintenanceMessage />)
    }
    if(code=="shrestrict"){
        return (<div>you are restricted for the shopping.contact admin of URC Bagdogra</div>)
    }
    if(code=="slclose"){
        return (<MaintenanceMessage />)

    }
    if(code=="slrestrict"){
        return (<div>you are restricted for the slot booking.contact admin of URC Bagdogra</div>)

    }
}
   

return(
    <div className='main'>
        {rendervalue()}
    </div>
)
}

export default Info