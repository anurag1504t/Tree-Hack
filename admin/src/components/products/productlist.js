import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import ProductNavBar from '../productnav'
import Loading from '../loading'

const Productlist= ()=>{

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
           setcategory(d);}
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
        if(result.err) setmsg("error loading")
        else{
          setdata(result.products)
          setlist(result.products)
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

const filterproduct=(quer)=>{
    setquery(quer)
    let userpattern=new RegExp(quer,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)||userpattern.test(val.category)
    })
    setlist(dd);
   }

return(

   <div className='main'>
       <ProductNavBar />
       
   <div class='headt'> products list  </div>
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
        list.map(item=>{
            return(
            <div className='product2'><Link to={`/productdetails/${item._id}`} className='ll'>
                <div><img src={item.image} height='100px' width='100px' /></div>
                <div>name: {item.name}</div>
                <div>quantity: {item.quantity}</div>
                <div>price: {item.price}</div>
                <div>category: {item.category}</div></Link>
                <div>
                    <Link to={`/editproduct/${item._id}`}><button>edit product</button></Link>
                </div>
            </div>
            )
        }):
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

export default Productlist