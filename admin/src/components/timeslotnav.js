import React from 'react'
import {Link} from 'react-router-dom'

const TimeslotNavBar=()=> {

    return (
      <div>
          <ul>
              <li><Link to='/ordertimeslot'>orders timeslot</Link></li>
              <li><Link to='/bookingtimeslot'>booking timeslot</Link></li>

              
          </ul>
      </div>
    );
  }
  
  export default TimeslotNavBar;