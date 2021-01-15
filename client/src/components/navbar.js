import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { usercontext } from "../App";
import Tiger from "../img/Tiger.png";
import "../stylesheet/navbar.css";
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse} from 'reactstrap';
import {serverurl} from '../config'

const NavBar=()=> {

    const{state,dispatch}=useContext(usercontext) 
    const [panel, setPanel] = useState(false);
    const history=useHistory()

    function toggleNav () {
        if(!panel) setPanel(true);
        else setPanel(false);
    }

    function toggleFalse () {
        setPanel(false);
    }

    const renderlist=()=>{

            if(state){
                return (
                    <React.Fragment>
                    <Navbar dark expand="md">
                        <div className="container"> 
                            <NavbarToggler onClick={toggleNav} />
                            <img src="https://res.cloudinary.com/dgn00dl3s/image/upload/v1610719674/fashiontree_zcy24d.png" width="70px" ></img>              
                            <NavbarBrand className="mr-auto" href="/"><div className="home-title"><strong><em>Tree Fashion Studio</em></strong></div></NavbarBrand> 
                            <Collapse isOpen={panel} navbar>                            
                            <Nav navbar>
                                <NavItem className='rout' key="1" onClick={toggleFalse}>
                                    <Link className="nav-link" to="/profile">
                                        <span className="fa fa-home fa-lg"></span> Account
                                    </Link>
                                </NavItem>                    
                                <NavItem className='rout' key="3" onClick={toggleFalse}>
                                    <Link className="nav-link" to="/shop">
                                        <span className="fa fa-shopping-bag"></span> Shop
                                    </Link>
                                </NavItem>

                                <NavItem className='rout' key="4" onClick={toggleFalse}>
                                    <Link className="nav-link" to="/windowslotbooking">
                                        <span className="fa fa-scissors"></span> Custom 
                                    </Link>
                                </NavItem>
                                {/* <NavItem className='rout' key="5" onClick={toggleFalse}>
                                    <Link className="nav-link" to="/orders">
                                        orders
                                    </Link>
                                </NavItem> */}
                                <NavItem className='rout' key="2" onClick={toggleFalse}>
                                    <Link className="nav-link" to="/cart">
                                        <span className="fa fa-shopping-cart"></span> cart
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="6" onClick={toggleFalse}>
                                    <Link className="nav-link" to="/" onClick={()=>{
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
                                        <span className="fa fa-sign-out"></span> logout
                                    </Link>
                                </NavItem>
                            </Nav> 
                            </Collapse>
                        </div>
                    </Navbar>
                    </React.Fragment>                      
                )
            }
            else{
                return (
                    <React.Fragment>
                    <Navbar dark expand="md" >
                        <div className="container" > 
                            <NavbarToggler onClick={toggleNav} />                                           
                            <img src={Tiger} width="70px" ></img>              
                            <NavbarBrand className="mr-auto" href="/"><div className="home-title">URC Bagdogra</div></NavbarBrand>
                            <Collapse isOpen={panel} navbar> 
                            <Nav navbar>                            
                                <NavItem className='rout' key="7" onClick={toggleFalse} >
                                    <Link className="nav-link" to="/login">
                                        <span className="fa fa-sign-in"></span> login
                                    </Link>
                                </NavItem>
                                <NavItem className='rout' key="8" onClick={toggleFalse} >
                                    <Link className="nav-link" to="/signup">
                                        <span className="fa fa-user-plus"></span> signup
                                    </Link>
                                </NavItem>
                                
                            </Nav>  
                            </Collapse> 
                        </div>
                    </Navbar>  
                    </React.Fragment>
                )
            }
       
    }
    return (
        <div>
            {renderlist()}
        </div>      
    );
}
  
export default NavBar;
