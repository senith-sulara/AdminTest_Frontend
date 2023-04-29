import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import WorkIcon from "@mui/icons-material/Work";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants";

/**
 *
 * @returns Display product details
 *
 *
 */
const ProductDeatils = () => {
  const [getProductData, setProductData] = useState([]);
  console.log(getProductData);

  const { id } = useParams("");
  console.log(id);

  const history = useNavigate();

  const getdata = async () => {
    const res = await fetch(`${API_URL}/products/getProduct/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 422 || !data) {
      console.log("error ");
    } else {
      setProductData(data);
      console.log("get data");
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const deleteProduct = async (id) => {
    const res2 = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const deletedata = await res2.json();
    console.log(deletedata);

    if (res2.status === 422 || !deletedata) {
      console.log("error");
    } else {
      console.log("product deleted");
      history("/home");
    }
  };

  return (
    <div className="container mt-3">
      <h1 style={{ fontWeight: 400 }}>Product Details</h1>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <div className="add_btn">
            <NavLink to={`/edit/${getProductData._id}`}>
              {" "}
              <button className="btn btn-primary mx-2">
                <CreateIcon />
              </button>
            </NavLink>
            <button
              className="btn btn-danger"
              onClick={() => deleteProduct(getProductData._id)}
            >
              <DeleteOutlineIcon />
            </button>
          </div>
          <div className="row">
            <div className="left_view col-lg-6 col-md-6 col-12">
              <img
                style={{ height: 50, width: 50, borderRadius: "10%" }}
                src={getProductData.Images}
                alt=""
              />
              <h3 className="mt-3">
                SKU: <span>{getProductData.SKU}</span>
              </h3>
              <h3 className="mt-3">
                Product Name: <span>{getProductData.ProductName}</span>
              </h3>
              <p className="mt-3">
                <MailOutlineIcon />
                Price: <span>{getProductData.Price}</span>
              </p>
            </div>
            <div className="right_view  col-lg-6 col-md-6 col-12">
              <p className="mt-5">
                <PhoneAndroidIcon />
                Description: <span>{getProductData.Description}</span>
              </p>
              <p className="mt-3">
                <LocationOnIcon />
                Images: <span> </span>
              </p>
              <p className="mt-3">
                <WorkIcon />
                Quantity: <span>{getProductData.Quantity}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDeatils;
