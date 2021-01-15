import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import ProductNavBar from '../productnav'
import Loading from '../loading'
import confirm from "reactstrap-confirm";

const UpdateQuantity= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [query,setquery]=useState("")
   const [page,setpage]=useState(1)
   const [loading,setloading]=useState(false)
   const [pages,setpages]=useState([1])
   const [pagenum,setpagenum]=useState(1)
   const [prod,setprod]=useState({type:'category',value:'all'})
   const [category,setcategory]=useState([])
   const [msg,setmsg]=useState("")

   const [quantitylist,setquantity]=useState({})
   const [pricelist,setprice]=useState({})
   const [maxquantitylist,setmaxquantity]=useState({})
   



   useEffect(()=>{
    setvalues()
   },[data])

    useEffect(()=>{
        fetch(serverurl+'/products/getcategory',{
            method:"get",
            headers:{
               Authorization:"Bearer "+localStorage.getItem("token"),
            }
         }).then(res=>res.json())
         .then(result=>{
             if(result.err) setmsg("error loading category")
             else{
           let d=[]
           for(var i=0;i<result.category.length;i++){
            d.push(result.category[i])
           }
           setcategory(d);
           
        }
         }).catch(err=>{setmsg("error loading category")})
    },[])

    useEffect(() => {
        getresult(1)
    }, [prod])

    const searchcategory=(quer)=>{
        let d={type:'category',value:quer}
        setprod(d);
     }
     const searchproduct=(quer)=>{
      let d={type:'search',value:query}
      setprod(d);
   }
   const getresult=(pg)=>{
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
        if(result.err) setmsg("error loading")
        else{
          setlist(result.products)
          setdata(result.products)
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
          setpagenum(result.pages)
        }
          setloading(true)
       }).catch(err=>{
          setloading(true)
          setmsg("error loading products")
       })
   }



const setvalues=()=>{
    let quantity={}
   let price={}
   let maxquantity={}
    for(var i=0;i<data.length;i++){
        quantity[data[i]._id]=data[i].quantity
        price[data[i]._id]=data[i].price
        maxquantity[data[i]._id]=data[i].maxQuantity
    }
    setquantity(quantity)
    setprice(price)
    setmaxquantity(maxquantity)
}

const setq=(id,pq)=>{
    let quantity={}
    for(let key in quantitylist){
        quantity[key]=quantitylist[key]
    }
    quantity[id]=pq
    setquantity(quantity)
}
const setp=(id,pp)=>{
    let price={}
    for(let key in pricelist){
        price[key]=pricelist[key]
    }
    price[id]=pp
    setprice(price)
}
const setmxq=(id,pmxq)=>{
    let maxquantity={}
    for(let key in maxquantitylist){
        maxquantity[key]=maxquantitylist[key]
    }
    maxquantity[id]=pmxq
    setmaxquantity(maxquantity)
}

const filterproduct=(quer)=>{
    setquery(quer)
    let userpattern=new RegExp(quer,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)||userpattern.test(val.category)
    })
    setlist(dd);
   }

const updateq=async(id)=>{
    setmsg("")
    let result = await confirm(
        {
            title: ( "dear admin"),
            message: "do you really want to update this product values?",
            confirmText: "ok",
            confirmColor: "primary",
            cancelText: "cancel"
        }
    ); 
    if(result==false) return false
    if(!(pricelist[id]&&quantitylist[id]&&maxquantitylist[id])){
        let result = await confirm(
            {
                title: ( "dear admin"),
                message: "fill all the values correctly",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: ""
            }
        ); 
        return false
    }
    fetch(`${serverurl}/products/productvalues/update`,{
        method:"put",
        headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
           id:id,
           quantity:quantitylist[id],
           price:pricelist[id],
           maxquantity:maxquantitylist[id]
        })
     }).then(res=>res.json())
     .then(async result=>{
        if(result.err) setmsg("error updating values")
        else{
            let resulttt = await confirm(
                {
                    title: ( "dear admin"),
                    message: result.name+" updated successfully",
                    confirmText: "ok",
                    confirmColor: "primary",
                    cancelText: ""
                }
            ); 
            setmsg(result.name+" updated successfully")
        }
     }).catch(err=>{
        setmsg("error updating product")
     })
}

return(

   <div className='main'>
   <ProductNavBar />
   
   <div class='headt'> update product quantity and price  </div>
       <div>{msg}</div>
       <div className="row">
                <div className='dropdown category col-3'>
                    <div><button className='dropbtn'>categories</button></div>
                    <div className='dropdown-content'>
                        <span onClick={()=>searchcategory("all")}>All</span>
                        {
                           category?
                           category.map(item=>{
                              return(
                                 <span onClick={()=>searchcategory(item)}>{item}</span>
                              )
                           })
                           :
                           <span>No Category</span>
                        }
                    </div>
                </div>
            
                <div>
                    <input type='text' value={query} onChange={(e)=>filterproduct(e.target.value)} placeholder='search' />
                </div>
                <div>
                    <button onClick={()=>searchproduct()}>search</button>
                </div>
            </div>
<div className='list'>
    {
        list&&loading?
        <table>
            <tr>
                <th>image</th>
                <th>name</th>
                <th>quantity</th>
                <th>price</th>
            </tr>
        {list.map(item=>{
            return(
            <tr>
                <td><img src={item.image} height='100px' width='100px' /></td>
                <td>{item.name}</td>
                <td><input className='ip' type='number' id={item.id} value={quantitylist[item._id]} onChange={(e)=>setq(item._id,e.target.value)} /></td>
                <td><input className='ip' type='number' id={item.id} value={pricelist[item._id]} onChange={(e)=>setp(item._id,e.target.value)} /></td>
                <td>
                    <button onClick={()=>updateq(item._id)}>submit</button>
                </td>
            </tr>
            )
        })}</table>
        :
            <Loading />
    }</div>
      {
       list.length==0&&loading?
       <div>no products found</div>:
       <div></div>
    }
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
   </div>

)

}

export default UpdateQuantity