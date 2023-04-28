import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { updatedata } from "./context/ContextProvider";
import { API_URL } from "../utils/constants";

const UpdateProduct = () => {
  const { updata, setUPdata } = useContext(updatedata);

  const history = useNavigate();

  const [state, setState] = useState({
    SKU: "",
    ProductName: "",
    Price: "",
    Description: "",
    Quantity: "",
  });

  const setdata = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setState((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
  };

  const { id } = useParams("");
  console.log(id);

  const getdata = async () => {
    const res = await fetch(`${API_URL}/products/getProduct/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 422 || !data) {
      console.log("error ");
    } else {
      setState(data);
      console.log("get data");
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const updateProduct = async (e) => {
    e.preventDefault();

    const { SKU, Description, Quantity, Price, desc, ProductName } = state;

    const res2 = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
      },
      body: JSON.stringify({
        SKU,
        Description,
        Quantity,
        Price,
        desc,
        ProductName,
      }),
    });

    const data2 = await res2.json();
    console.log(data2);

    if (res2.status === 400 || !data2) {
      alert("fill the data");
    } else {
      history("/home");
      setUPdata(data2);
    }
  };

  return (
    <div className="container">
      <NavLink to="/home">Home</NavLink>
      <form className="mt-4">
        <div className="row">
          <div class="mb-3 col-lg-6 col-md-6 col-12">
            <label for="exampleInputPassword1" class="form-label">
              SKU
            </label>
            <input
              type="SKU"
              value={state.SKU}
              onChange={setdata}
              name="SKU"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div class="mb-3 col-lg-6 col-md-6 col-12">
            <label for="exampleInputPassword1" class="form-label">
              Product Name
            </label>
            <input
              type="text"
              value={state.ProductName}
              onChange={setdata}
              name="ProductName"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div class="mb-3 col-lg-6 col-md-6 col-12">
            <label for="exampleInputPassword1" class="form-label">
              Price
            </label>
            <input
              type="number"
              value={state.Price}
              onChange={setdata}
              name="Price"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div class="mb-3 col-lg-6 col-md-6 col-12">
            <label for="exampleInputPassword1" class="form-label">
              Quantity
            </label>
            <input
              type="text"
              value={state.Quantity}
              onChange={setdata}
              name="Quantity"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
        
            <label for="exampleInputPassword1" class="form-label">
              Description
            </label>
            <textarea
              value={state.Description}
              onChange={setdata}
              name="Description"
              class="form-control"
              cols="25" rows="5"
            />
          
          {/* <div class="mb-3 col-lg-12 col-md-12 col-12">
                        <label for="exampleInputPassword1" class="form-label">Description</label>
                        <textarea name="desc" value={state.desc} onChange={setdata} className="form-control" id="" cols="30" rows="5"></textarea>
                    </div> */}

          <button type="submit" onClick={updateProduct} className="updatetbtn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
