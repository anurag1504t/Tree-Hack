import React,{useState} from 'react'
import {serverurl} from '../../config'
import {useHistory} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'
import confirm from "reactstrap-confirm";

const AddProduct= ()=>{

   const [msg,setmsg]=useState("")
   const [name,setname]=useState("")
   const [size,setsize]=useState("")
   const [price,setprice]=useState("")
   const [quantity,setquantity]=useState("")
   const [category,setcategory]=useState("")
   const [max,setmax]=useState("")
   const [loading,setloading]=useState(true)
   const [url,seturl]=useState("")
   const history=useHistory()

const updateproduct=async (e)=>{
   e.preventDefault()
   
   setmsg("")
   let result = await confirm(
      {
          title: ( "dear admin"),
          message: "do you really want to add this product?",
          confirmText: "ok",
          confirmColor: "primary",
          cancelText: "cancel"
      }
  ); 
  if(result==false) return false
  setloading(false)
    fetch(`${serverurl}/products/add`,{
        method:"post",
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
        if(!result.err){
           setmsg("product added successfully")
           let resultt = await confirm(
            {
                title: ( "dear admin"),
                message: "product is added successfully",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: "cancel"
            }
        ); 
        history.push('/productlist')
        }else{
           setmsg("error adding product")
        }
        setloading(true)
     }).catch(err=>{
        setloading(true)
        setmsg("error adding product")
     })
}


return(

   <div className='main'>
      <ProductNavBar />
   <div class='headt'> add products  </div>
       <div>{msg}</div>

    {loading?
        <div>
        <form onSubmit={(e)=>updateproduct(e)}>
            <div>name: <input value={name} onChange={(e)=>setname(e.target.value)} /></div>
            <div>price <input value={price} onChange={(e)=>setprice(e.target.value)} /></div>
            <div>quantity <input value={quantity} onChange={(e)=>setquantity(e.target.value)} /></div>
            <div>category <input value={category} onChange={(e)=>setcategory(e.target.value)} /></div>
            <div>image url <input value={url} onChange={(e)=>seturl(e.target.value)} /></div>
    <input type='submit' value='submit' />
    </form>
        </div>:<Loading />
    }
   </div>

)

}

export default AddProduct