import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {serverurl} from '../config'
import Loading from './loading'
import { Card, CardImg, CardSubtitle, CardTitle, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import '../stylesheet/shop.css'

const Shop= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [cart,setcart]=useState({})
   const [ab,setab]=useState({})
   const [query,setquery]=useState("")
   const [page,setpage]=useState(1)
   const [loading,setloading]=useState(false)
   const [initload,setinitload]=useState(false)

   const [pages,setpages]=useState([1])
   const [pagenum,setpagenum]=useState(1)
   const [prod,setprod]=useState({type:'category',value:'all'})
   const [category,setcategory]=useState([])
   const [msg,setmsg]=useState("")
   const history=useHistory()

   useEffect(() => {
      load()
   },[])
   
 const load=()=>{
    fetch(serverurl+'/products/getcategory',{
        method:"get",
        headers:{
           Authorization:"Bearer "+localStorage.getItem("token")
        }
     }).then(res=>res.json())
     .then(result=>{
        if(result.err) setmsg("error loading the categories")
       else {let d=[]
       for(var i=0;i<result.category.length;i++){
        d.push(result.category[i])
       }
       setcategory(d);}
     }).catch(err=>{
        setmsg("error loading the categories")
     })
    fetch(serverurl+'/cart/',{
       method:"get",
       headers:{
          Authorization:"Bearer "+localStorage.getItem("token"),
       }
    }).then(res=>res.json())
    .then(result=>{
      if(result.err) setmsg("error loading the page") 
      else{updatecart(result.items)
       setinitload(true)}
    }).catch(err=>{
      setmsg("error loading the page")
   })
 }
 useEffect(() => {
     getresult(1)
 }, [prod])
   
   const updatecart=(cartarray)=>{
      let c={}
      for(var i in cartarray){
         c[cartarray[i].item._id]=cartarray[i].quantity
         }
      setcart(c);
   }
   const filterproduct=(quer)=>{
       setquery(quer)
    let userpattern=new RegExp(quer,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)
    })
    setlist(dd);
   }

   const searchcategory=(quer)=>{
      let d={type:'category',value:quer}
      setprod(d);
   }
   const searchproduct=(quer)=>{
    let d={type:'search',value:query}
    setprod(d);
 }
 const getresult=(pg)=>{
   setmsg("")
    setloading(false)
     let url=''
    if(prod.type=='category'){
        if(prod.value=='all'){
            url='/products/allproducts'
        }else{
        url='/products/category'
    }
    }else{
        url='/products/search'
    }
    fetch(serverurl+url,{
        method:"post",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           query:prod.value,
           pgnum:pg
        })
     }).then(res=>res.json())
     .then(result=>{
      if(result.err) setmsg("error loading page")  
      else{setdata(result.products)
        setlist(result.products)
        setaddbutton(result.products)
        setpage(pg)
        let l=pg-1>5?5:pg-1;
        let r=result.pages-pg>5?5:result.pages
        l=r<5?l+5-r:l;
        r=l<5?r+5-l:r;
      let d=[]
        for(var i=pg-l;i<=pg+r;i++){
           if(i<1) i=1;
           if(i>result.pages) break;
         d.push(i)
        }
        setpages(d)
        setpagenum(result.pages)}

        setloading(true)
        setquery("")
     }).catch(err=>{
        setmsg("error loading the page")
     })
 }

const setaddbutton=(prod)=>{
   let l={}
   for(var i in prod){
      l[prod[i]._id]=true;
   }
   setab(l);
}

const changeb=(id,bool)=>{
   let l={}
   for(let key in ab){
      l[key]=ab[key]
   }
   l[id]=bool;
   setab(l)
}

   const addtocart=(id)=>{
      setmsg("")
      if(ab[id]==false) return false
      changeb(id,false)
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
      changeb(id,true)
         if(result.err) setmsg("error adding to cart")
         else updatecart(result.items);

      }).catch(err=>{
         changeb(id,true)
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
         if(result.err) setmsg("error removing from cart")
         else updatecart(result.items);
      }).catch(err=>{
         setmsg("error removing from the cart")
      })
   }


return(
   <div>

   <div className='main-shop'>
   <div className='alert' style={{textAlign:'center'}}>{msg}</div>
      {
      loading&&initload?
      <div className='main-shop'>
            <div className="row row-shop">
                <UncontrolledDropdown className="dropdown category col">
                    <DropdownToggle caret>
                        Categories
                    </DropdownToggle>
                    <DropdownMenu>
                    <DropdownItem header>Categories</DropdownItem>
                    <DropdownItem onClick={()=>searchcategory("all")}>All</DropdownItem>
                    {
                        category?
                        category.map(item=>{
                            return(
                                <DropdownItem onClick={()=>searchcategory(item)}>{item}</DropdownItem>
                            )
                        })
                        :
                        <span>No Category</span>
                    }
                  </DropdownMenu>
                </UncontrolledDropdown>
            
                <div className="category col">
                    <input size="10px" type='text' value={query} onChange={(e)=>filterproduct(e.target.value)} placeholder='search' />
                </div>
                <div className="category col">
                    <button className="search-btn fa fa-search" onClick={()=>searchproduct()}></button>
                </div>
            </div>
         
         <h6>Ready-made Apparels</h6><br></br>
         <div className='row container'> 
            {  list?
                list.filter((item) => item.category === "ready").map(item=>{
                    return(   
                        <div className="col-12 col-md-2 mb-4 ">
                            <Card className="shop-product-card">
                                <CardTitle className='t'>{item.name}</CardTitle>
                                <CardSubtitle>{item.size}</CardSubtitle>
                                <CardImg height="200px" width="auto" src={item.image} alt={item.name} />
                                {/* <div><img src={item.image} height='200px' width='200px' /></div> */}
                                <div className='t'>₹ {item.price}</div>
                               { item.quantity!=0?<div><div>
                                    <button className='shop-button' disabled={item.quantity>0&&ab[item._id]?((cart[item._id]>=item.maxQuantity||cart[item._id]>=item.quantity)?true:false):true} onClick={()=>addtocart(item._id)}>+</button>
                                    <span className='t'>{cart[item._id]?cart[item._id]:0}</span>
                                    <button className='shop-button' disabled={cart[item._id]?(cart[item._id]>0?false:true):true} onClick={()=>removefromcart(item._id)}>-</button>
                                </div>
                                {
                                   item.quantity>= 30?
                                   <div className="in-stock">IN STOCK</div>
                                   :<div></div>                                   
                                }
                                    {/* <div>max quantity : {item.maxQuantity}</div> */}
                                {/* <div>total quantity : {item.quantity}</div> */}
                                </div>
                                :<div className="out-stock">OUT OF STOCK</div>
                               }
                               {
                                  (item.quantity!=0 && item.quantity< 30)?
                                  <div className="limited-avail">LIMITED AVAILABILTY</div>
                                  :<div></div>                                  
                               }
                            </Card>
                        </div>
                    )
                }):
                <Loading />
            }
         </div>

         <h6>ornament</h6><br></br>
         <div className='row container'> 
            {  list?
                list.filter((item) => item.category === "ornament").map(item=>{
                    return(   
                        <div className="col-12 col-md-2 mb-4 ">
                            <Card className="shop-product-card">
                                <CardTitle className='t'>{item.name}</CardTitle>
                                <CardSubtitle>{item.size}</CardSubtitle>
                                <CardImg height="200px" width="auto" src={item.image} alt={item.name} />
                                {/* <div><img src={item.image} height='200px' width='200px' /></div> */}
                                <div className='t'>₹ {item.price}</div>
                               { item.quantity!=0?<div><div>
                                    <button className='shop-button' disabled={item.quantity>0&&ab[item._id]?((cart[item._id]>=item.maxQuantity||cart[item._id]>=item.quantity)?true:false):true} onClick={()=>addtocart(item._id)}>+</button>
                                    <span className='t'>{cart[item._id]?cart[item._id]:0}</span>
                                    <button className='shop-button' disabled={cart[item._id]?(cart[item._id]>0?false:true):true} onClick={()=>removefromcart(item._id)}>-</button>
                                </div>
                                {
                                   item.quantity>= 30?
                                   <div className="in-stock">IN STOCK</div>
                                   :<div></div>                                   
                                }
                                    {/* <div>max quantity : {item.maxQuantity}</div> */}
                                {/* <div>total quantity : {item.quantity}</div> */}
                                </div>
                                :<div className="out-stock">OUT OF STOCK</div>
                               }
                               {
                                  (item.quantity!=0 && item.quantity< 30)?
                                  <div className="limited-avail">LIMITED AVAILABILTY</div>
                                  :<div></div>                                  
                               }
                            </Card>
                        </div>
                    )
                }):
                <Loading />
            }
         </div>

         <h6>fabric</h6><br></br>
         <div className='row container'> 
            {  list?
                list.filter((item) => item.category === "fabric").map(item=>{
                    return(   
                        <div className="col-12 col-md-2 mb-4 ">
                            <Card className="shop-product-card">
                                <CardTitle className='t'>{item.name}</CardTitle>
                                <CardSubtitle>{item.size}</CardSubtitle>
                                <CardImg height="200px" width="auto" src={item.image} alt={item.name} />
                                {/* <div><img src={item.image} height='200px' width='200px' /></div> */}
                                <div className='t'>₹ {item.price}</div>
                               { item.quantity!=0?<div><div>
                                    <button className='shop-button' disabled={item.quantity>0&&ab[item._id]?((cart[item._id]>=item.maxQuantity||cart[item._id]>=item.quantity)?true:false):true} onClick={()=>addtocart(item._id)}>+</button>
                                    <span className='t'>{cart[item._id]?cart[item._id]:0} m</span>
                                    <button className='shop-button' disabled={cart[item._id]?(cart[item._id]>0?false:true):true} onClick={()=>removefromcart(item._id)}>-</button>
                                </div>
                                {
                                   item.quantity>= 30?
                                   <div className="in-stock">IN STOCK</div>
                                   :<div></div>                                   
                                }
                                    {/* <div>max quantity : {item.maxQuantity}</div> */}
                                {/* <div>total quantity : {item.quantity}</div> */}
                                </div>
                                :<div className="out-stock">OUT OF STOCK</div>
                               }
                               {
                                  (item.quantity!=0 && item.quantity< 30)?
                                  <div className="limited-avail">LIMITED AVAILABILTY</div>
                                  :<div></div>                                  
                               }
                            </Card>
                        </div>
                    )
                }):
                <Loading />
            }
         </div>

        <div>
           {
              list.length==0&&loading?
              <div>no products found</div>
              :<div></div>
           }
        </div>
        <div>
            {
                pages?
                pages.map(item=>{
                    return(
                        <button disabled={item==page?true:false} onClick={()=>getresult(item)}>{item}</button>
                    )
                }):"loading"
            }
            <div>... total {pagenum} pages</div>
        </div>
   </div>:
    <Loading />
}
   </div>
   <br></br><br></br>
   </div>
)

}

export default Shop