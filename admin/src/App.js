import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import NavBar from "./components/navbar"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/home'
import Login from './components/login'

import Signupreq from './components/user/requests'
import Userlist from './components/user/userlist'
import UserEdit from './components/user/edituser'
import Userdetails from './components/user/userdetails'


import Productlist from './components/products/productlist'
import AddProduct from './components/products/addproduct'
import Productdetails from './components/products/productdetails'
import UpdateQuanity from './components/products/updatequantity'
import ProductEdit from './components/products/editproduct'

import Orderlist from './components/order/orders'
import Bookinglist from './components/order/slotbooking'
import Def from './components/def'
import Ordertimeslot from './components/timeslot/orderslot'
import Bookingtimeslot from './components/timeslot/bookingslot'


import News from './components/news/news'
import Sys from './components/sys/sys'

import {initialstate,reducer} from './reducers/userreducer'
import OrderDetails from './components/order/orderdetails';
export const usercontext=createContext()

const Routing=()=>{
  const history=useHistory() 
  const {state,dispatch}=useContext(usercontext)

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    const tdt=localStorage.getItem("tokendate")
    if(user&&tdt){
        let dt=new Date();
        let tdate=Date.parse(tdt)
        if(tdate<=dt){
            localStorage.clear();
            history.push('/')
        }else{
            dispatch({type:"USER",payload:user})
        }
    }
    else{
        history.push('/')
    }
  },[])
  return (
<Switch>
    <Route exact path='/'>
      <Home />
    </Route>
    <Route path='/login'>
      <Login />
    </Route>
    <Route path='/news'>
      <News />
    </Route>
    <Route path='/sys'>
      <Sys />
    </Route>
    <Route path='/userlist'>
      <Userlist />
    </Route>
    <Route path='/signuprequests'>
      <Signupreq />
    </Route>
    <Route path='/userdetails/:username'>
      <Userdetails />
    </Route>
    <Route path='/edituser/:username'>
      <UserEdit />
    </Route>

    <Route path='/productlist'>
      <Productlist />
    </Route>
    <Route path='/addproduct'>
      <AddProduct />
    </Route>
    <Route path='/productvalueupdate'>
      <UpdateQuanity />
    </Route>
    <Route path='/productlist'>
      <Productlist />
    </Route>
    <Route path='/editproduct/:productid'>
      <ProductEdit />
    </Route>
    <Route path='/productdetails/:productid'>
      <Productdetails />
    </Route>

    <Route path='/orderlist'>
      <Orderlist />
    </Route>
    <Route path='/bookinglist'>
      <Bookinglist />
    </Route>
    <Route path='/orderdetail/:orderid'>
      <OrderDetails />
    </Route>

    <Route path='/bookingtimeslot'>
      <Bookingtimeslot />
    </Route>
    <Route path='/ordertimeslot'>
      <Ordertimeslot />
    </Route>
    <Route path=''>
      <Def />
    </Route>

    </Switch>
  )
}

function App() {

  const [state,dispatch]=useReducer(reducer,initialstate)

  return (
    <usercontext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <div>
      <NavBar/>
      <Routing />
    </div>
    </BrowserRouter>
    </usercontext.Provider>

  );
}

export default App;
