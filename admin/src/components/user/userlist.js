import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import {Link} from 'react-router-dom'
import Loading from '../loading'

import Usernav from '../usernav'
const Userlist= ()=>{

   const [data,setdata]=useState([])
   const [list,setlist]=useState([])
   const [msg,setmsg]=useState("")
   const [query,setquery]=useState("")

  const [page,setpage]=useState(1)
   const [loading,setloading]=useState(false)
   const [pages,setpages]=useState([1])
   const [pagenum,setpagenum]=useState(1)
   const [prod,setprod]=useState({type:'all',value:'all'})


    useEffect(() => {
        getresult(1)
    }, [prod])

const searchall=()=>{
        let d={type:'all',value:"all"}
        setprod(d);
     }
const searchuser=()=>{
      let d={type:'search',value:query}
      setprod(d);
   }
   const getresult=(pg)=>{
       setmsg("")
      setloading(false)
       let url=''
      if(prod.type=='all'){
              url='/users/allusers'
      }else{
          url='/users/search'
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
          setdata(result.users)
          setlist(result.users)
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
       }).catch(err=>{
           setmsg("error loading")
           setloading(true)
       })
   }

const filteruser=(quer)=>{
    setquery(quer)
    let userpattern=new RegExp(quer,"i")
    let dd=data.filter(val=>{
        return userpattern.test(val.name)||userpattern.test(val.username)||userpattern.test(val.email)||userpattern.test(val.mobileNumber)
    })
    setlist(dd);
    setmsg("")
   }

return(

   <div className='main'>
       
   <div class='headt'> users list </div>
   <div><button onClick={()=>searchall()}>all users</button>
       <input type='text' onChange={(e)=>filteruser(e.target.value)} placeholder='search' />
       <button onClick={()=>searchuser()}>search</button>
       </div>
       <div>{msg}</div>
       <div className='list'>
    {
        list&&loading?
        list.map(item=>{
            return(
            <div className='product2'>
                <Link to={`/userdetails/${item.username}`} className='ll'>
                <div>name: {item.name}</div>
                <div>username: {item.username}</div>
                <div>email: {item.email}</div>
                <div>mobile number: {item.mobileNumber}</div>
                </Link>
                <div>
                    <Link to={`/edituser/${item.username}`}><button>edit user</button></Link>
                </div>
            </div>
            )
        }):
        <div>
            <Loading />
        </div>
    }</div>
     {
       list.length==0&&loading?
       <div>no users found</div>:
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

export default Userlist