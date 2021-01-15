import React,{useState,useEffect} from 'react'
import {serverurl} from '../../config'
import Loading from '../loading'
import confirm from "reactstrap-confirm";
import  'reactstrap'

const News= ()=>{

   const [data,setdata]=useState([])
   const [feeddata,setfeed]=useState("")
   const [msg,setmsg]=useState("")
   const [loading,setloading]=useState(false)

   const getfeeds=()=>{
    fetch(serverurl+'/feeds/',{
        method:"get",
        query:JSON.stringify({})
     }).then(res=>res.json())
     .then(result=>{
         if(!result.err){
        setdata(result)
        setloading(true)}
        else{
            setmsg("error loading")
            setloading(true)
        }
     }).catch(err=>{
         setmsg("error loading")
         setloading(true)
     })
   }

    useEffect(()=>{
        getfeeds();
    },[])
    
    const deletenews=async (id)=>{
        setmsg("")

        let result = await confirm(
            {
                title: ( "dear admin"),
                message: "do you really want to delete this news item?",
                confirmText: "ok",
                confirmColor: "primary",
                cancelText: "cancel"
            }
        ); 
        if(result==false) return false

        fetch(`${serverurl}/feeds/${id}`,{
            method:"delete",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("token")
            }
         }).then(res=>res.json())
         .then(result=>{
             if(result.err) setmsg("error deleting")
             else{let d=data.filter(item=>{return item._id!=id})
             setdata(d)
             setmsg("news item deleted")}
         }).catch(err=>{
            setmsg("error deleting news item")
         })
    }

    const addnews=()=>{
        setmsg("")
        if(feeddata.length<10){
            setmsg("min length of news is 10")
            return false
        }

        let fd=feeddata
        setfeed("")
        fetch(`${serverurl}/feeds/`,{
            method:"post",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("token")
            },
            body:JSON.stringify({
               feeds:fd
            })
         }).then(res=>res.json())
         .then(result=>{
             if(result.err) setmsg("error adding")
             else{let d=data;
             d.push(result)
             setdata(d)
             setmsg("news item added")}

         }).catch(err=>{
            setmsg("error adding news item")
         })
    }


return(

   <div className='main'>
       <div class='headt'> add and delete news  </div>

       <div>{msg}</div>
<div className='list'>
    {
        data&&loading?
        data.map(item=>{
            return(
            <div className='product2'>
                <div>{item.feeds}</div>
                <div><button onClick={()=>deletenews(item._id)}>delete</button></div>
            </div>
            )
        }):
        <Loading />
    }</div>
    <div>
    <div><textarea value={feeddata} onChange={(e)=>setfeed(e.target.value)} /></div>
    <div><button onClick={()=>addnews()}>submit</button></div>
    </div>
   </div>

)

}

export default News