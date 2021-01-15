import React from 'react';
import logo from '../img/logo.png'
import logo2 from '../img/logo2.jpg'
// import '../stylesheet/style.css';
import { Link } from 'react-router-dom';

export const Header = () => {
    return(
        <div className="logo col-12">
            <div key='11' className='logobar'>
                <img src={logo} alt="" height='100px' width='100px' /> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link to='/'>
                    <img src={logo2} alt="" height='60px' width='300px' />
                </Link> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <img src={logo} alt="" height='100px' width='100px' />
            </div>
            <br></br>
            <br></br>
            <br></br>
        </div>
    );
};