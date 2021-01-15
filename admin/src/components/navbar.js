import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'
import logo from '../img/logo.png'
import logo2 from '../img/logo2.jpg'
import '../stylesheet/style.css';
import {serverurl} from '../config'

const NavBar=()=> {

    const{state,dispatch}=useContext(usercontext) 
    const history=useHistory()
    const renderlist=()=>{
        if(state){
            return [
                <div className='rout' key="1"><Link to="/userlist">users</Link></div>,
                   
                <div className='rout' key="2"><Link to="/productlist">products</Link></div>,
                <div className='rout' key="4"><Link to="/orderlist"> orders</Link></div>,
                <div className='rout' key="5"><Link to="/news">NOTICE</Link></div>,
                <div className='rout' key="7">
                    <Link onClick={()=>{
                        fetch(serverurl+"/users/logout",{
                            method:"get",
                            headers:{
                                "Content-Type":"application/json",
                                Authorization:"Bearer "+localStorage.getItem("token")
                            }
                        }).then(res=>res.json())
                        .then(data=>{
                            localStorage.clear();
                            dispatch({type:"CLEAR"})
                            history.push('/')
                        }).catch(err=>{
                            localStorage.clear();
                            dispatch({type:"CLEAR"})
                            history.push('/')
                        })
                    }}>
                        logout
                    </Link>
                </div>,
                  
            ]
        }else{
            return [
                
                <div className='rout' key="8"><Link to="/login">login</Link></div>
            ]
        }
    }
    return (
      <nav>
          <div className='logo' >
              <div>
                  {renderlist()}
              </div>
          </div>
      </nav>
    );
  }
  
  export default NavBar;