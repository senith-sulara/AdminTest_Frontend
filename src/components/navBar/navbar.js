import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import logo from "../../images/adminlogo.png";
export default function Navbar() {
  let history = useNavigate();
  const [user, setUser] = useState(null);
/*
*
* admin navigation bar
* IF token is not null nav bar will display
*/
  useEffect(() => {
    const getUserData = () => {
      setUser(JSON.parse(localStorage.getItem("TOKEN")));
    };
    getUserData();
  }, []);

  const logOut = () => {
    history("/");
    localStorage.clear();
  };
  return (
    <nav className="nav">
      {localStorage.getItem("TOKEN") ? (
        <>
          <ul>
            <button className="logbtn" onClick={logOut}>
              {" "}
              ADMIN{" "}
            </button>
            <span className="adlogo">
              {" "}
              <img src={logo} alt="" width={30} height={30} />{" "}
            </span>
          </ul>
        </>
      ) : (
        <></>
      )}
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
