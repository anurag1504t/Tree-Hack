import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import { useParams,useHistory} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'
import confirm from "reactstrap-confirm";

const EditProduct= ()=>{

   const [data,setdata]=useState([])
   const [msg,setmsg]=useState("")
   const {productid}=useParams()
   const [name,setname]=useState("")
   const [size,setsize]=useState("")
   const [quantity,setquantity]=useState("")
   const [category,setcategory]=useState(false)
   const [max,setmax]=useState(false)
   const [price,setprice]=useState(0)
   const [url,seturl]=useState(false)
   const [loading,setloading]=useState(false)
   const history=useHistory()

    useEffect(()=>{

        fetch(`${serverurl}/products/${productid}`,{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
            if(result.err) setmsg("error loading product")
            else{
            setdata(result)
            setname(result.name)
            setsize(result.size)
            setquantity(result.quantity)
            setcategory(result.category)
            seturl(result.image)
            setmax(result.maxQuantity)
            setprice(result.price)
            }
            setloading(true)
         }).catch(err=>{
            setmsg("error loading")
            setloading(true)
         })
    },[])



const updateproduct=async (e)=>{
   e.preventDefault()
   setmsg("")
   let result = await confirm(
      {
          title: ( "dear admin"),
          message: "do you really want to update this product?",
          confirmText: "ok",
          confirmColor: "primary",
          cancelText: "cancel"
      }
  ); 
  if(result==false) return false
  
  setloading(false)
    fetch(`${serverurl}/products/${productid}`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           name:name,size:size,quantity:quantity,maxQuantity:max,
           image:url,category:category,price:price
        })
     }).then(res=>res.json())
     .then(async result=>{
        if(result.err) setmsg("error updating product")
        else {
           setmsg("updated successfully")
           let result = await confirm(
            {
                title: ( "dear admin"),
                message: "product is updated successfully",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: ""
            }
        ); 
        }
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error updating product")
     })
}

const delproduct=async ()=>{
   setmsg("")
   let result = await confirm(
      {
          title: ( "dear admin"),
          message: "do you really want to delete this product?",
          confirmText: "ok",
          confirmColor: "primary",
          cancelText: "cancel"
      }
  ); 
  if(result==false) return false
   setloading(false)
    fetch(`${serverurl}/products/${productid}`,{
        method:"delete",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        }
     }).then(res=>res.json())
     .then(async result=>{
        if(result.err) setmsg("error loading product")
        else {
        setmsg("product deleted successfully")
        let result = await confirm(
         {
             title: ( "dear admin"),
             message: "product is deleted successfully",
             confirmText: "ok",
             confirmColor: "primary",
             cancelText: ""
         }
     ); 
     history.push('/productlist')
        }
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error deleting product")
     })
}

return(

   <div className='main'>
   <ProductNavBar />

   
   <div class='headt'> edit product  </div>
       <div>{msg}</div>

    {
        data&&loading?<div>
        <form onSubmit={(e)=>updateproduct(e)}>
            <div>name: <input value={name} onChange={(e)=>setname(e.target.value)} /></div>
            <div>price <input value={price} onChange={(e)=>setprice(e.target.value)} /></div>
            <div>quantity <input value={quantity} onChange={(e)=>setquantity(e.target.value)} /></div>
            <div>category <input value={category} onChange={(e)=>setcategory(e.target.value)} /></div>
            <div>image url <input value={url} onChange={(e)=>seturl(e.target.value)} /></div>
    <input type='submit' value='submit' />
    </form>
    <button className='redbutton' onClick={()=>{delproduct()}}>delete product</button>
        </div>:
        <Loading />
    }
   </div>

)

}

export default EditProduct