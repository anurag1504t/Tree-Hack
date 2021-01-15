import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from "./components/navbar"

import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/home'
import Profile from './components/profile'
import Login from './components/login'
import Signup from './components/signup'
import Signupmsg from './components/signupmsg'
import Cart from './components/cart'
import Checkout from './components/checkout'
import Shop from './components/shop'
import Final from './components/final'
import Info from './components/info'
import Changepwd from './components/changepwd'
import Changeslot from './components/changeslot'
import WindowFinal from './components/windowfinal'
import WindowSlotBook from './components/windowslot'
import Def from './components/def'

import {initialstate,reducer} from './reducers/userreducer'
import { Footer } from './components/footer';
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
            <Route path='/shop'>
                <Shop />
            </Route>
            <Route path='/signup'>
                <Signup />
            </Route>
            <Route path='/signupmsg/:name'>
                <Signupmsg />
            </Route>
            <Route exact path='/profile'>
                <Profile />
            </Route>
            <Route path='/cart'>
                <Cart />
            </Route>
            <Route path='/checkout'>
                <Checkout />
            </Route>
            <Route path='/final/:id'>
                <Final />
            </Route>
            <Route path='/changepwd'>
                <Changepwd />
            </Route>
            <Route path='/info/:code'>
                <Info />
            </Route>
            <Route path='/windowfinal/:id'>
                <WindowFinal />
            </Route>
            <Route path='/changeslot/:oid'>
                <Changeslot />
            </Route>
            <Route path='/windowslotbooking'>
                <WindowSlotBook />
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
            {/* <Header /> */}
                <div>
                    <NavBar/>
                    <Routing />
                 
                    <Footer /> 
                </div>             
            </BrowserRouter>
        </usercontext.Provider>
    );
}

export default App;
