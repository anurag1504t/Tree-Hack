import React,{useState,useEffect} from 'react'
import {serverurl} from '../config'
import {Link,useHistory} from 'react-router-dom'
import Loading from './loading'
import '../stylesheet/cart.css'
import confirm from "reactstrap-confirm";
import { Card, CardTitle, CardSubtitle, CardImg } from 'reactstrap'


const Cart= ()=>{

   const [data,setdata]=useState([])
   const [loading,setloading]=useState(false)
   const history=useHistory()
   const [msg,setmsg]=useState("")

   useEffect(() => {
      load()
   },[])

const load=()=>{
      fetch(serverurl+'/cart/',{
         method:"get",
         query:JSON.stringify({}),
         headers:{
            Authorization:"Bearer "+localStorage.getItem("token"),
         }
      }).then(res=>res.json())
      .then(result=>{
        if(!result.err){let cc=result.items.filter(val=>{
            return val.quantity!=0
        })
         setdata(cc)}else{setmsg("error loading cart items")}
         setloading(true)
      }).catch(err=>{
         setloading(true)
         setmsg("error loading the cart items")
      })
   }
   let total=0

   const updatecart=(cartarray)=>{
      let c=[]
      cartarray=cartarray.filter(item=>{
         return item.quantity!=0
      })
      for(var i in cartarray){
         c.push(cartarray[i])
         }
      setdata(c);
   }

   const addtocart=(id)=>{
      setmsg("")

      fetch(`${serverurl}/cart/add/${id}`,{
         method:"put",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         },
         body:JSON.stringify({
            productid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         if(!result.err){updatecart(result.items);}
         else{setmsg("error adding to the cart")}
      }).catch(err=>{
         setmsg("error adding to the cart")
      })
   }

   const removefromcart=(id)=>{
      setmsg("")

      fetch(`${serverurl}/cart/remove/${id}`,{
         method:"put",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
         },
         body:JSON.stringify({
            productid:id
         })
      }).then(res=>res.json())
      .then(result=>{
         if(!result.err){updatecart(result.items);}
         else setmsg("error removing from the cart")
      }).catch(err=>{
         setmsg("error removing from the cart")
      })
   }
const emptycart=async ()=>{
   setmsg("")
   let result = await confirm(
      {
          title: ( "dear user"),
          message: "are you sure you want to empty the cart?",
          confirmText: "ok",
          confirmColor: "primary",
          cancelText: "cancel"
      }
  ); 
  if(result==false) return false;
  else setloading(false)

   fetch(`${serverurl}/cart/emptycart`,{
      method:"get",
      headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem("token")
      }
   }).then(res=>res.json())
   .then(result=>{
      if(!result.err){updatecart(result.items);}
      else setmsg("error emptying the cart")
      setloading(true)
   }).catch(err=>{
      setloading(true)
      setmsg("error emptying the cart")
   })
}
return(
    <div className="container">
        <div className="main-cart">
        <div className='alert' style={{textAlign:'center'}}>{msg}</div>
        </div>
        <div className="cart-items">
            <ul className='cartlist row'>
                {data&&loading?
                data.map(item=>{
                    total+=item.item.price*item.quantity;
                    return (
                        <li className='list-unstyled col-12 col-md-3'>
                            <Card className="cartobj">
                                <CardImg height="300px" width="auto" src={item.item.image} alt={item.item.name} />
                                <div>
                                    <CardTitle>{item.item.name}</CardTitle>
                                    Current Quantity<br></br><button className='add cart-button' disabled={item.item.quantity>0?((item.quantity>=item.item.maxQuantity||item.quantity>=item.item.quantity)?true:false):true} onClick={()=>addtocart(item.item._id)}>+</button>
                                    {item.quantity}
                                    <button className='remove cart-button' disabled={false}  onClick={()=>removefromcart(item.item._id)}>-</button>
                                </div>
                                <div>
                                    Unit Price: ₹ {item.item.price}<br></br>
                                    Subtotal: ₹ {item.item.price*item.quantity}
                                </div>

                            </Card>                        
                        </li>
                    )
                })
                :<div className="container"><div className="cart-loading">
                <Loading /></div></div>
                }
            </ul>
        </div>
        <div className="cart-checkout">
            {loading?(
            data.length==0?
            <div className="empty-cart">
            <h3>Your Shopping Cart is empty</h3>
            <p>To add items go to the shop page</p></div>:
            <div className="cart-checkout">
            <div className='ta'>
                total amount: {total} INR
            </div>
            <div className="inline">
            <Link to='/checkout'> <button className="cart-button">checkout</button></Link> 
            
               <button className="cart-button" onClick={()=>{emptycart()}}>empty cart</button>
               </div>
            </div>):<div></div>          
            }
        </div>
    </div>
    )
}

export default Cart
