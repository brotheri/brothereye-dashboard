import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

function NavBar(){
    return(
        <nav className="navbar navbar-expand-sm navbar-dark">
          <div className="container">
            <Link className="navbar-brand" to={"/SignIn"}>Brother Eye</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-in"}>Login</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    )
}

export default NavBar