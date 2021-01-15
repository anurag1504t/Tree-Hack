import React from 'react'
import {Link} from 'react-router-dom'

const ProductNavBar=()=> {

    return (
        <nav>
      <div>
          <ul>
              <li><Link to='/addproduct'>add product</Link></li>
              <li><Link to='/productlist'>products list</Link></li>
              <li><Link to='/productvalueupdate'>products update</Link></li>

              
          </ul>
      </div></nav>
    );
  }
  
  export default ProductNavBar;