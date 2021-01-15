import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import {Link, useParams} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'

const Productdetails= ()=>{

   const [data,setdata]=useState([])
   const {productid}=useParams()
   const [msg,setmsg]=useState("")
   const [loading,setloading]=useState(false)


    useEffect(()=>{
        fetch(`${serverurl}/products/${productid}`,{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
            setloading(true)
            if(result.err) setmsg("error loading product")
            else setdata(result)
         }).catch(err=>{
            setmsg("error loading")
            setloading(true)
         })
    },[])


return(

   <div className='main'>
   <ProductNavBar />
   <div class='headt'> product details </div>

    {
        data&&loading?<div>
            <div><img src={data.image} height='100px' width='100px' /></div>
                <div>name: {data.name}</div>
                <div>size: {data.size}</div>
                <div>price: {data.price}</div>
                <div>quantity: {data.quantity}</div>
                <div>max Quantity: {data.maxQuantity}</div>
                <div>category: {data.category}</div>
                <Link to={`/editproduct/${data._id}`}><button>edit product</button></Link>

        </div>:
           <Loading />
    }
   </div>

)

}

export default Productdetails