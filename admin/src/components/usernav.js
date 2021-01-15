import React from 'react'
import {Link} from 'react-router-dom'

const UserNavBar=()=> {

    return (
        <nav>
      <div>
          <ul>
              {/* <li><Link to='/signuprequests'>requests</Link></li> */}
              <li><Link to='/userlist'>users list</Link></li>
              
          </ul>
      </div>
      </nav>
    );
  }
  
  export default UserNavBar;