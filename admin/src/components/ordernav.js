import React from 'react'
import {Link} from 'react-router-dom'

const OrderNavBar=()=> {

    return (
      <div>
          <ul>
              <li><Link to='/orderlist'>orders list</Link></li>
              <li><Link to='/bookinglist'>booking list</Link></li>

              
          </ul>
      </div>
    );
  }
  
  export default OrderNavBar;