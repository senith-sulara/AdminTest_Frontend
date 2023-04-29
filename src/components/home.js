import React, { useState, useEffect, useContext } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { NavLink } from "react-router-dom";
import { adddata, deldata } from "./context/ContextProvider.js";
import { updatedata } from "./context/ContextProvider.js";
import { IconButton } from "@mui/material";
import "./home.css";
import StarIcon from "@mui/icons-material/Star";
import TextField from "@material-ui/core/TextField";
import useBookmarks from "./favorite.js";
import Swal from "sweetalert2";
import axios from "axios";
const Home = () => {
  const [getuserdata, setUserdata] = useState([]);
  console.log(getuserdata);

  const { udata, setUdata } = useContext(adddata);

  const { updata, setUPdata } = useContext(updatedata);

  const { dltdata, setDLTdata } = useContext(deldata);

  //Retrive data from server
  const getdata = async () => {
    const res = await fetch("http://localhost:8070/products/getAllProducts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 422 || !data) {
      console.log("error ");
    } else {
      setUserdata(data);
      console.log("get data");
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  // Add to favorite localstorage
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [bookmarks, toggleBookmark] = useBookmarks();

  const changeBookMarksOnly = (e) => {
    setBookmarksOnly(e.target.onClick);
  };
  const favorite = async () => {
    setUserdata(
      getuserdata.filter((s) => (bookmarksOnly ? bookmarks.includes(s._id) : s))
    );
  };

  //  const addToCart = (id, productId, quantity) => dispatch => {
  //     axios.post(`/products/addtoFave/${id}`, {productId, quantity})
  //         .then(res => dispatch({
  //             payload: res.data
  //         }))
  //         .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
  // }

  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  //delete products
  const deleteProducts = (id) => {
    // e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to undo this action if you proceed!",
      icon: "warning",
      // dangerMode: true,
      showCancelButton: true,
      confirmButtonColor: "#001eb9",
      cancelButtonColor: "#d33",
      iconColor: "red",
      confirmButtonText: "Delete",
      reverseButtons: true,
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        axios.delete(`http://localhost:8070/products/${id}`).then((res) => {
          getdata();
          Swal.fire({
            title: "Done!",
            text: "product has been deleted!",
            icon: "success",
            timer: 2000,
            button: false,
          });
        });
      }
    });
  };

  return (
    <>
      <div className="row"></div>
      <div className="mt-5">
        <div className="container">
          <div className="mb-3 col-lg-6 col-md-6 col-12">
            <label className="header1">PRODUCTS</label>
          </div>
          <div className="row">
            <div className="col">
              {/* <div className="add_btn mt-2 mb-2"> */}
              <input
                type="text"
                value={""}
                onChange={{}}
                name="Search"
                class="form-control"
                id="searchbar"
              />
            </div>
            <div className="col">
              <button type="searchbtn" onClick={{}} id="searchbtn">
                Search
              </button>
            </div>
            <div className="col col-lg-2">
              <NavLink to="/addproduct" className="btn btn-primary" id="addbtn">
                New Product
              </NavLink>
              <IconButton id="starbtn">
                <StarIcon />
              </IconButton>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr className="table-light">
                <th scope="col">SKU</th>
                <th scope="col">IMAGE</th>
                <th scope="col">PRODUCT NAME</th>
                <th scope="col">PRICE</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {getuserdata.map((element, id) => {
                return (
                  <>
                    <tr>
                      {/* <th scope="row">{id + 1}</th> */}
                      <td>{element.SKU}</td>
                      <td>
                        <img
                          style={{ height: 50, width: 50, borderRadius: "10%" }}
                          src={element.Images}
                          alt=""
                        />
                      </td>
                      <td>{element.ProductName}</td>
                      <td>
                        {"$"}
                        {element.Price}
                      </td>
                      <td id="actionbtn">
                        <NavLink to={`/viewproduct/${element._id}`}>
                          {" "}
                          <button className="btn" id="icodel">
                            <RemoveRedEyeIcon />
                          </button>
                        </NavLink>
                        <NavLink to={`/updateproduct/${element._id}`}>
                          {" "}
                          <button className="btn" id="icodel">
                            <CreateIcon />
                          </button>
                        </NavLink>
                        <button
                          className="btn"
                          id="icodel"
                          onClick={() => deleteProducts(element._id)}
                        >
                          <DeleteOutlineIcon />
                        </button>
                        <button
                          className="btn"
                          id="icodel"
                          onClick={toggleBookmark(element._id)}
                        >
                          <StarIcon />
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Home;
