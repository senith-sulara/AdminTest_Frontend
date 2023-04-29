import React, { useState, useRef, Component } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Dropzone from "react-dropzone";
import axios from "axios";
import { API_URL } from "../utils/constants";
import dummy from "../images/dummy.png";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CategoryIcon from "@mui/icons-material/Category";
//dialog box import

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "85%",
    margin: "auto",
    marginTop: "20px",
  },
  alert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
  },
  form: {
    width: "90%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  btnGroup: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(2),
    },
  },
  formControl: {
    marginTop: theme.spacing(1),
    width: "90%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  headerpro: {
    marginBottom: theme.spacing(2),
    fontSize: "40px",
    fontWeight: "bold",
  },
  headersub: {
    fontSize: "35px",
    paddingLeft: "10px",
    color: "#001EB9",
  },
}));

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const AddProducts = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [image, setImage] = useState(null); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(""); // state for storing previewImage
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = useRef(); // React ref for managing the hover state of droppable area
  const [state, setState] = useState({
    SKU: "",
    ProductName: "",
    Price: "",
    Description: "",
    Quantity: "",
    errors: {
      SKU: "",
      ProductName: "",
      Price: "",
      Description: "",
      Quantity: "",
    },
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [open, setOpen] = useState(false);

  const onDrop = (images) => {
    const [uploadedFile] = images;
    setImage(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    dropRef.current.style.border = "2px dashed #e9ebeb";
  };

  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };

  //Insert data
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setOpen(true);
    try {
      const { SKU, ProductName, Price, Description, Quantity } = state;
      if (validateForm(state.errors)) {
        console.info("Valid Form");
        if (
          SKU.trim() !== "" &&
          ProductName.trim() !== "" &&
          Price.trim() !== "" &&
          Description.trim() !== "" &&
          Quantity.trim() !== ""
        ) {
          if (image) {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("SKU", SKU);
            formData.append("ProductName", ProductName);
            formData.append("Price", Price);
            formData.append("Description", Description);
            formData.append("Quantity", Quantity);

            setErrorMsg("");
            await axios.post(`${API_URL}/products/insert`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
              },
            });
            setSuccessMsg("upload Success");
            // setOpenSucc(true);
            navigate("/home");
          } else {
            setErrorMsg("Please select a image to add.");
            // setOpenErr(true);
          }
        } else {
          setErrorMsg("Please enter all the field values.");
          // setOpenErr(true);
        }
      } else {
        setErrorMsg("Please enter valid field values.");
      }
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
      // setOpenErr(true);
    }
  };

  //validations
  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = state.errors;

    switch (name) {
      case "SKU":
        errors.SKU = value.length < 0 ? "SKU can not be Empty!" : "";
        break;
      case "ProductName":
        errors.ProductName =
          value.length < 0 ? "Product Name can not be Empty!" : "";
        break;
      case "Price":
        errors.Price = value.length < 4 ? "Price can not be Empty!" : "";
        break;
      default:
        break;
    }
    setState({
      ...state,
      [event.target.name]: event.target.value,
      errors,
      [name]: value,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { errors } = state;
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <div className={classes.paper}>
        <br />
        <div className="row">
          <div className="mb-3 col-lg-6 col-md-6 col-12">
            <label className={classes.headerpro}>PRODUCTS {">"} </label>
            <label className={classes.headersub}> Add New Products </label>
          </div>
        </div>
        <form className={classes.form} noValidate onSubmit={handleOnSubmit}>
          <div className={classes.alert}>
            <Dialog
              open={open}
              onClose={handleClose}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{
                  cursor: "move",
                  backgroundColor: "#02032b",
                  color: "#ffffff",
                }}
                id="draggable-dialog-SKU"
              >
                <CategoryIcon /> ECOM
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {successMsg != "" ? (
                    <>
                      <div style={{ color: "#008000" }}>
                        <CheckIcon />
                        {successMsg}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: "#aa202b" }}>
                        <ClearIcon />
                        {errorMsg}
                      </div>
                    </>
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div className="row">
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label className="form-label">SKU</label>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="SKU"
                name="SKU"
                autoComplete="SKU"
                autoFocus
                value={state.SKU || ""}
                onChange={handleChange}
                // onChange={handleInputChange}
              />
              {errors.SKU.length > 0 && (
                <span className="error">{errors.SKU}</span>
              )}
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label className="form-label">Product Name</label>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ProductName"
                // label="ProductName"
                name="ProductName"
                autoComplete="ProductName"
                autoFocus
                value={state.ProductName || ""}
                // onChange={handleInputChange}
                onChange={handleChange}
              />
              {errors.ProductName.length > 0 && (
                <span className="error">{errors.ProductName}</span>
              )}
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label className="form-label">Price</label>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Price"
                // label="Price"
                name="Price"
                autoComplete="Price"
                autoFocus
                value={state.Price || ""}
                // onChange={handleInputChange}
                onChange={handleChange}
              />
              {errors.Price.length > 0 && (
                <span className="error">{errors.Price}</span>
              )}
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label className="form-label">Description</label>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                // disabled
                id="Description"
                // label="Description"
                name="Description"
                autoComplete="Description"
                autoFocus
                value={state.Description || ""}
                // onChange={handleInputChange}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label className="form-label">Quantity</label>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
                id="Quantity"
                // label="Quantity"
                name="Quantity"
                autoComplete="Quantity"
                autoFocus
                value={state.Quantity || ""}
                // onChange={handleInputChange}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12"></div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label className="form-label">Product Images</label>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <div className="upload-section">
                <Dropzone
                  onDrop={onDrop}
                  onDragEnter={() => updateBorder("over")}
                  onDragLeave={() => updateBorder("leave")}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps({ className: "drop-zone" })}
                      ref={dropRef}
                    >
                      <input {...getInputProps()} />
                      <p>
                        Drag and drop a image OR click here to select a image
                      </p>
                      {image && (
                        <div>
                          <strong>Selected image:</strong> {image.name}
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
                <div className="prew">
                  {previewSrc ? (
                    isPreviewAvailable ? (
                      <div className="image-preview">
                        <img
                          className="preview-image"
                          src={previewSrc}
                          alt="Preview"
                          width="200px"
                          style={{ maxHeight: "200", maxWidth: "200" }}
                          align-item="center"
                        />
                      </div>
                    ) : (
                      <div className="preview-message">
                        <p>No preview available for this image</p>
                      </div>
                    )
                  ) : (
                    <div className="preview-message">
                      {/* <p>Image preview will be shown here after selection</p> */}
                      <img
                        src={dummy}
                        alt="John"
                        style={{
                          width: "250px",
                          height: "200px",
                          margin: "5px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.btnGroup}>
            <Button
              id="btnSave"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.sub}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </Grid>
  );
};

export default AddProducts;
