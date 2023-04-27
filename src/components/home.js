import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants.js";
import "./home.css";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const ProductAdmin = (props) => {
  const { useState } = React;
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [successMsg, setSuccessMsg] = useState([]);
  const [issucc, setIssucc] = useState(false);

  //get all book details
  useEffect(() => {
    const getFileList = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8070/products/getAllProducts`, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        });
        setErrorMsg("");
        setData(data);
        console.log(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
        console.log(error);
      }
    };

    getFileList();

    console.log(data);
  }, []);

  const [columns, setColumns] = useState([
    {
      title: "Image",
      field: "file",
      render: (rowData) => (
        <img
          style={{ height: 50, width: 50, borderRadius: "10%" }}
        //   src={asset(`http://localhost:8070/${rowData.image_path}`)}
        // src={require('http://localhost:8070/${rowData.file}')}
          src={ (rowData.images) }

        />
      ),
    },
    { title: "SKU", field: "SKU" },
    { title: "Quantity", field: "Quantity" },
    { title: "Product Name", field: "ProductName" },
    { title: "Description", field: "Description" },
  ]);

  /////////////////////////update rows
  const api = axios.create({
    baseURL: `http://localhost:8070`,
  });

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    if (newData.SKU === "") {
      errorList.push("Please enter SKU");
    }
    if (newData.ProductName === "") {
      errorList.push("Please enter ProductName");
    }
    if (newData.Quantity === "") {
      errorList.push("Please enter Quantity");
    }
    if (newData.Description === "") {
      errorList.push("Please enter Description");
    }

    if (errorList.length < 1) {
      api
        .put("/products/" + newData._id, newData, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        })
        .then((res) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
          setIserror(false);
        })
        .catch((error) => {
          setErrorMsg(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMsg(errorList);
      setIserror(true);
      resolve();
    }
  };

  ////////////Delete Row

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete("/products/" + oldData._id, {
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      })
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
        setSuccessMsg(["Delete success"]);
        setIssucc(true);
      })
      .catch((error) => {
        setErrorMsg(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div>
      <br />
      <br />
      <h1 id="h12" align="left">
        PRODUCTS
      </h1>
      <div className="tbl">
        <div>
          {iserror && (
            <Alert severity="error">
              {errorMsg.map((msg, i) => {
                return <div key={i}>{msg}</div>;
              })}
            </Alert>
          )}

          {issucc && (
            <Alert severity="success">
              {successMsg.map((msg, i) => {
                return <div key={i}>{msg}</div>;
              })}
            </Alert>
          )}
        </div>

        <MaterialTable
          title={
            ''
          }
          columns={columns}
          data={data}
          icons={{
            Add: props => (
              <Button
              id="btnAdd"
              variant="contained"
              color="primary"
              href="/insertBook"
            >
              Add new Book
            </Button>
            ),
          }}
          // editable={{
          //   onRowUpdate: (newData, oldData) =>
          //     new Promise((resolve, reject) => {
          //       handleRowUpdate(newData, oldData, resolve);
          //     }),

          //   onRowDelete: (oldData) =>
          //     new Promise((resolve, reject) => {
          //       handleRowDelete(oldData, resolve);
          //     }),
          // }}
          options={{
            headerStyle: {
              backgroundColor: "rgba(8, 9, 80, 0.363)",
              color: "rgba(0, 0, 0)",
            },
            actionsColumnIndex: -1,
            searchFieldAlignment: "left",
            searchFieldStyle: {
              borderRadius: "30px",
              disableUnderline: true,
              border: "1px solid #707070",
            }
          }}
          actions={[
            {
              icon: 'delete',
              tooltip: 'Delete User',
              onClick: (event, oldData) => new Promise((resolve, reject) => {
                      handleRowDelete(oldData, resolve);
                    }),
            },
            {
              icon: 'edit',
              tooltip: 'Edit User',
              onClick: (event, rowData) => alert('You are editing ' + rowData.name)
            },
            {
              icon: 'star',
              iconProps: { color: "#01579b"  },
              tooltip: 'Favorite',
              
              onClick: (event, rowData) => {
                // Do save operation
              }
            }
          ]}
        />
      </div>
    </div>
  );
};

export default ProductAdmin;