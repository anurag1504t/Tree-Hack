import '../stylesheet/footer.css';
import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import '../stylesheet/footer.css';
import { serverurl } from "../config";

export const Footer = () => {
  return (
      <div className="yoyos">
    <MDBFooter color="blue" className="font-small pt-4 mt-4 container">
      <MDBContainer fluid className="text-right text-md-right">
        <MDBRow>
          <MDBCol md="5">
            <h5 className="title">About</h5>
            <ul>
              <li className="list-unstyled">
                Idea<br></br> <a href="#">AAA</a>
              </li>
              <li className="list-unstyled">
              Design & Development<br></br><a href="#">Team Tree Fashion Studio</a>
              </li>
            </ul>            
          </MDBCol>          
          <MDBCol md="4">
            <h5 className="title">Contact Us</h5>
            <ul>
              <li className="list-unstyled">
                Phone<br></br><a href="#!">+911234567890</a>
              </li>
              <li className="list-unstyled">
                Email<br></br><a href="#!">tree@gmail.com</a>
              </li>
              </ul>
          </MDBCol>
          <MDBCol md="3">
            <h5 className="title">Address</h5>
            <ul>
              <li className="list-unstyled">
                <a href="#!">Tree Fashion Studio<br></br>
                XYZ</a>
              </li>
              
              </ul>
          </MDBCol>
          
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="#">  Tree Fashion Studio</a>
        </MDBContainer>
      </div>
    </MDBFooter>
    </div>
  );
};

