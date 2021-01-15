import React, { useState, useEffect, useContext } from "react";
import { usercontext } from "../App";
import { Link } from "react-router-dom";
import { serverurl } from "../config";
import ReactLoading from "react-loading";
import { UncontrolledCarousel } from "reactstrap";
import "../stylesheet/home.css";
import F1 from "../img/f1.jpeg";
import F2 from "../img/f2.jpg";

const Home = () => {
  const [data, setdata] = useState([]);
  const { state, dispatch } = useContext(usercontext);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    fetch(serverurl + "/feeds/", {
      method: "get",
      query: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((result) => {
        setdata(result);
        setloading(true);
      });
  }, []);

  return (
    
      <div className="container">
        <div className="air-force">
          <AirForce />
        </div>

        <div className="main-home">
          <h2 className="news"> NEW OFFERS </h2>
          <div>
            {data && loading ? (
              <ul className="list-unstyled">
                {data.map((item) => {
                  return (
                    <li key={item._id}  >
                      <p className="newsdata font-alt mb-30 titan-title-size-1">{item.feeds}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ReactLoading
                type="bars"
                color="floralwhite"
                height={667}
                width={375}
              />
            )}
            {data.length == 0 && loading ? (
              <div>No new offers</div>
            ) : (
              <div></div>
            )}
            <br></br>
          </div>
        </div>
      </div>
    
  );
};

const items = [
  {
    
    src: F1,
    key: "1",
    className: "air-force-item",
  },
  {
    src:
      F2,
    key: "3",
    className: "air-force-item",
  }
];

const AirForce = () => <UncontrolledCarousel items={items} />;

export default Home;
